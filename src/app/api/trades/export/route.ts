import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/middleware/auth'

export async function GET(_request: NextRequest) {
  await requireAuth()
  
  const trades = await prisma.trade.findMany({
    orderBy: { entryDate: 'desc' },
  })
  
  const { searchParams } = new URL(_request.url)
  const format = searchParams.get('format') || 'csv'
  
  if (format === 'json') {
    return NextResponse.json({ trades })
  }
  
  // CSV export
  const headers = ['symbol', 'direction', 'entryPrice', 'exitPrice', 'stopPrice', 'targetPrice', 'quantity', 'pnl', 'setupType', 'entryDate', 'exitDate', 'notes']
  const rows = trades.map((t: any) => [
    t.symbol,
    t.direction,
    t.entryPrice,
    t.exitPrice || '',
    t.stopPrice || '',
    t.targetPrice || '',
    t.quantity || '',
    t.pnl || '',
    t.setupType || '',
    t.entryDate.toISOString(),
    t.exitDate?.toISOString() || '',
    (t.notes || '').replace(/"/g, '""')
  ].join(','))
  
  const csv = [headers.join(','), ...rows].join('\n')
  
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="trades.csv"',
    },
  })
}
