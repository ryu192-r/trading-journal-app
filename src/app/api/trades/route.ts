import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, getUserIdFromToken } from '@/middleware/auth';
import { classifyMarketRegime, computeMAE } from '@/lib/analytics/calculator';

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
  
  // Get user ID from token
  const userId = await getUserIdFromToken()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    userId,
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
    // Behavioral analytics fields (Phase 3)
    if (body.emotionPre) tradeData.emotionPre = body.emotionPre
    if (body.emotionDuring) tradeData.emotionDuring = body.emotionDuring
    if (body.emotionPost) tradeData.emotionPost = body.emotionPost
    if (body.sleepHours != null) tradeData.sleepHours = parseFloat(body.sleepHours)
    if (body.fatigueLevel != null) tradeData.fatigueLevel = parseInt(body.fatigueLevel, 10)
    if (body.distractions) tradeData.distractions = body.distractions

    // Compute regime from entry date
    tradeData.regime = await classifyMarketRegime(tradeData.entryDate)
  
   // Compute P&L if exit price provided
   if (tradeData.exitPrice) {
     const qty = tradeData.quantity || 1
     const priceDiff = direction === 'LONG'
       ? tradeData.exitPrice - tradeData.entryPrice
       : tradeData.entryPrice - tradeData.exitPrice
     tradeData.pnl = priceDiff * qty
   }

   // Compute MAE for closed trades
   if (tradeData.exitPrice) {
     const maeResult = await computeMAE(tradeData)
     tradeData.mae = maeResult?.maeAbs ?? null
   }

   const trade = await prisma.trade.create({ data: tradeData })
  
  return NextResponse.json({ trade }, { status: 201 })
}
