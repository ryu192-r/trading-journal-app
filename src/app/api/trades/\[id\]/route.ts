import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/middleware/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireAuth()
  
  const trade = await prisma.trade.findUnique({
    where: { id: params.id }
  })
  
  if (!trade) {
    return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
  }
  
  return NextResponse.json({ trade })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireAuth()
  const body = await request.json()
  
  const existing = await prisma.trade.findUnique({
    where: { id: params.id }
  })
  if (!existing) {
    return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
  }
  
  const updateData: any = {}
  if (body.symbol) updateData.symbol = body.symbol.toUpperCase()
  if (body.direction) updateData.direction = body.direction.toUpperCase()
  if (body.entryPrice != null) updateData.entryPrice = parseFloat(body.entryPrice)
  if (body.exitPrice != null) updateData.exitPrice = parseFloat(body.exitPrice)
  if (body.stopPrice != null) updateData.stopPrice = parseFloat(body.stopPrice)
  if (body.targetPrice != null) updateData.targetPrice = parseFloat(body.targetPrice)
  if (body.quantity != null) updateData.quantity = Math.floor(body.quantity)
  if (body.setupType) updateData.setupType = body.setupType
  if (body.notes !== undefined) updateData.notes = body.notes
  if (body.screenshotUrl !== undefined) updateData.screenshotUrl = body.screenshotUrl
  if (body.tags) updateData.tags = body.tags
  
  // Recompute P&L if exitPrice changed
  if (updateData.exitPrice) {
    const direction = updateData.direction || existing.direction
    const qty = updateData.quantity || existing.quantity || 1
    const entry = updateData.entryPrice || existing.entryPrice
    const exit = updateData.exitPrice
    const priceDiff = direction === 'LONG' ? exit - entry : entry - exit
    updateData.pnl = priceDiff * qty
  }
  
  const trade = await prisma.trade.update({
    where: { id: params.id },
    data: updateData,
  })
  
  return NextResponse.json({ trade })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await requireAuth()
  
  const existing = await prisma.trade.findUnique({
    where: { id: params.id }
  })
  if (!existing) {
    return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
  }
  
  await prisma.trade.delete({ where: { id: params.id } })
  
  return NextResponse.json({ success: true })
}
