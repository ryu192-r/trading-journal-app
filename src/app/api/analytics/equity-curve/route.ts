import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/middleware/auth'

export async function GET(_request: NextRequest) {
  await requireAuth()
  
  const trades = await prisma.trade.findMany({
    where: { exitPrice: { not: null } },
    orderBy: { entryDate: 'asc' },
  })
  
  let runningPnL = 0
  let maxDrawdown = 0
  let peak = 0
  
  const curve = trades.map((t: any) => {
    runningPnL += (t.pnl || 0)

    
    if (runningPnL > peak) {
      peak = runningPnL
    }
    
    const drawdown = peak - runningPnL
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
    
    return {
      date: t.entryDate,
      pnl: parseFloat(runningPnL.toFixed(2)),
      drawdown: parseFloat(drawdown.toFixed(2)),
      symbol: t.symbol,
      direction: t.direction,
    }
  })
  
  return NextResponse.json({
    curve,
    maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
    peak: parseFloat(peak.toFixed(2)),
    finalPnL: parseFloat(runningPnL.toFixed(2)),
  })
}
