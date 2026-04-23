import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/middleware/auth'

export async function GET(_request: NextRequest) {
  await requireAuth()
  
  const trades = await prisma.trade.findMany({
    where: { exitPrice: { not: null } },
  })
  
  if (trades.length === 0) {
    return NextResponse.json({
      winRate: 0,
      profitFactor: 0,
      avgWin: 0,
      avgLoss: 0,
      expectancy: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
    })
  }
  
  const wins = trades.filter((t: any) => (t.pnl || 0) > 0)
  const losses = trades.filter((t: any) => (t.pnl || 0) <= 0)
  
  const winRate = (wins.length / trades.length) * 100
  const avgWin = wins.length > 0 ? wins.reduce((sum: any, t: any) => sum + (t.pnl || 0), 0) / wins.length : 0
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum: any, t: any) => sum + (t.pnl || 0), 0) / losses.length) : 0
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : avgWin
  const expectancy = (winRate / 100) * avgWin - ((100 - winRate) / 100) * avgLoss
  
  return NextResponse.json({
    winRate: parseFloat(winRate.toFixed(2)),
    profitFactor: parseFloat((profitFactor || 0).toFixed(2)),
    avgWin: parseFloat(avgWin.toFixed(2)),
    avgLoss: parseFloat(avgLoss.toFixed(2)),
    expectancy: parseFloat(expectancy.toFixed(2)),
    totalTrades: trades.length,
    winningTrades: wins.length,
    losingTrades: losses.length,
  })
}
