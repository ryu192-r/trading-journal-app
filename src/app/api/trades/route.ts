import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/middleware/auth'

export async function GET(request: NextRequest) {
  await requireAuth()
  
  // Parse query params for filtering
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  const setupType = searchParams.get('setupType')
  const direction = searchParams.get('direction')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  
  const where: any = {}
  if (symbol) where.symbol = symbol
  if (setupType) where.setupType = setupType
  if (direction) where.direction = direction
  if (startDate || endDate) {
    where.entryDate = {}
    if (startDate) where.entryDate.gte = new Date(startDate)
    if (endDate) where.entryDate.lte = new Date(endDate)
  }
  
  const sortBy = searchParams.get('sortBy') || 'entryDate'
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

  const validSortFields = ['entryDate', 'symbol', 'direction', 'pnl', 'createdAt']
  const orderBy = validSortFields.includes(sortBy) 
    ? { [sortBy]: sortOrder as 'asc' | 'desc' }
    : { entryDate: 'desc' as const }

  const trades = await prisma.trade.findMany({
    where,
    orderBy,
  })
  
  return NextResponse.json({ trades })
}

export async function POST(request: NextRequest) {
  await requireAuth()
  const body = await request.json()
  
  // Required validation
  if (!body.symbol || !body.direction || body.entryPrice == null) {
    return NextResponse.json({ error: 'Missing required fields: symbol, direction, entryPrice' }, { status: 400 })
  }
  
  // Normalize direction
  const direction = body.direction.toUpperCase() === 'SHORT' ? 'SHORT' : 'LONG'
  
  // Build trade object
  const tradeData: any = {
    symbol: body.symbol.toUpperCase(),
    direction,
    entryPrice: parseFloat(body.entryPrice),
    entryDate: body.entryDate ? new Date(body.entryDate) : new Date(),
    tags: body.tags || [],
  }
  
  // Optional fields
  if (body.exitPrice != null) tradeData.exitPrice = parseFloat(body.exitPrice)
  if (body.stopPrice != null) tradeData.stopPrice = parseFloat(body.stopPrice)
  if (body.targetPrice != null) tradeData.targetPrice = parseFloat(body.targetPrice)
  if (body.exitDate) tradeData.exitDate = new Date(body.exitDate)
  if (body.quantity != null) tradeData.quantity = Math.floor(body.quantity)
  if (body.setupType) tradeData.setupType = body.setupType
  if (body.notes) tradeData.notes = body.notes
  if (body.screenshotUrl) tradeData.screenshotUrl = body.screenshotUrl
  
  // Compute P&L if exit price provided
  if (tradeData.exitPrice) {
    const qty = tradeData.quantity || 1
    const priceDiff = direction === 'LONG' 
      ? tradeData.exitPrice - tradeData.entryPrice
      : tradeData.entryPrice - tradeData.exitPrice
    tradeData.pnl = priceDiff * qty
  }
  
  const trade = await prisma.trade.create({ data: tradeData })
  
  return NextResponse.json({ trade }, { status: 201 })
}
