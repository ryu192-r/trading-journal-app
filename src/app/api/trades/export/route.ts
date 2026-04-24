import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/middleware/auth'

export async function GET(_request: NextRequest) {
  await requireAuth()
  
  const { searchParams } = new URL(_request.url)
  const format = searchParams.get('format') || 'csv'
  
  // Build filter from query params (same as trades list)
  const where: any = {}
  const symbol = searchParams.get('symbol')
  const direction = searchParams.get('direction')
  const setupType = searchParams.get('setupType')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  
  if (symbol) where.symbol = symbol
  if (direction) where.direction = direction
  if (setupType) where.setupType = setupType
  if (startDate || endDate) {
    where.entryDate = {}
    if (startDate) where.entryDate.gte = new Date(startDate)
    if (endDate) where.entryDate.lte = new Date(endDate)
  }
  
  const trades = await prisma.trade.findMany({
    where,
    orderBy: { entryDate: 'desc' },
  })
  
  if (format === 'json') {
    return NextResponse.json({ trades })
  }
  
  // CSV export with Indian date format (DD/MM/YYYY)
  const headers = ['symbol', 'direction', 'entryPrice', 'exitPrice', 'stopPrice', 'targetPrice', 'quantity', 'pnl', 'setupType', 'entryDate', 'exitDate', 'notes']
  const rows = trades.map((t: any) => {
    // Format date as DD/MM/YYYY
    const formatDate = (d: Date | null) => {
      if (!d) return ''
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      return `${day}/${month}/${year}`
    }
    
    const entryDateStr = formatDate(t.entryDate)
    const exitDateStr = formatDate(t.exitDate)
    
    // Quote fields that may contain commas
    const notes = (t.notes || '').replace(/"/g, '""')
    
    return [
      t.symbol,
      t.direction,
      t.entryPrice,
      t.exitPrice || '',
      t.stopPrice || '',
      t.targetPrice || '',
      t.quantity || '',
      t.pnl || '',
      t.setupType || '',
      entryDateStr,
      exitDateStr,
      `"${notes}"`,
    ].join(',')
  })
  
  const csv = [headers.join(','), ...rows].join('\n')
  
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="trades.csv"',
    },
  })
}
