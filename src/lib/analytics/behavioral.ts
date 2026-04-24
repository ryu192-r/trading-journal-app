import { prisma } from '@/lib/db'
import { Trade, EmotionType } from '@prisma/client'
import { computeRMultiple } from './calculator'

export type RevengePattern = {
  pattern: 'CLUSTER' | 'EOD_RUSH' | 'MONDAY_SPIKE'
  date: string // YYYY-MM-DD
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
}

export type OvertradingPattern = {
  pattern: 'EXCESSIVE' | 'EOD_RUSH' | 'MONDAY_SPIKE'
  date: string
  tradeCount: number
  avgBenchmark: number
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
}

export type EmotionStats = {
  pre: Record<EmotionType, { count: number; winRate: number; avgR: number; profitFactor: number }>
  during: Record<EmotionType, { count: number; winRate: number; avgR: number; profitFactor: number }>
  post: Record<EmotionType, { count: number; winRate: number; avgR: number; profitFactor: number }>
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

function toIST(date: Date): Date {
  return new Date(date.getTime() + IST_OFFSET_MS)
}

function isLosingTrade(trade: Trade): boolean {
  if (trade.exitPrice === null || trade.entryPrice === null) return false
  return trade.direction === 'LONG' 
    ? trade.exitPrice < trade.entryPrice 
    : trade.exitPrice > trade.entryPrice
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getDayOfWeek(date: Date): number {
  return toIST(date).getDay() // 0=Sunday, 1=Monday, etc.
}

export async function detectRevengeTrading(userId: string, lookbackDays = 7): Promise<RevengePattern[]> {
  const cutoff = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000)
  const trades = await prisma.trade.findMany({
    where: { userId, entryDate: { gte: cutoff }, exitPrice: { not: null } },
    orderBy: { entryDate: 'asc' }
  })

  const patterns: RevengePattern[] = []
  const tradeMap = new Map<string, Trade[]>()
  const processedClusters = new Set<string>()
  
  // Group trades by date (IST)
  trades.forEach(trade => {
    const istDate = toIST(trade.entryDate)
    const dateStr = getDateString(istDate)
    if (!tradeMap.has(dateStr)) tradeMap.set(dateStr, [])
    tradeMap.get(dateStr)!.push(trade)
  })

  // Check CLUSTER pattern
  for (let i = 0; i < trades.length; i++) {
    const losingTrade = trades[i]
    if (!isLosingTrade(losingTrade)) continue

    const windowStart = losingTrade.entryDate.getTime()
    const windowEnd = windowStart + 45 * 60 * 1000 // 45 minutes
    let clusterCount = 0

    for (let j = i + 1; j < trades.length; j++) {
      const nextTrade = trades[j]
      if (nextTrade.entryDate.getTime() > windowEnd) break
      clusterCount++
    }

    if (clusterCount >= 3) {
      const dateStr = getDateString(toIST(losingTrade.entryDate))
      const clusterKey = `${dateStr}-${losingTrade.id}`
      if (!processedClusters.has(clusterKey)) {
        processedClusters.add(clusterKey)
        patterns.push({
          pattern: 'CLUSTER',
          date: dateStr,
          description: `3+ trades within 45 minutes after losing trade on ${dateStr}`,
          severity: 'HIGH'
        })
      }
    }
  }

  // Check EOD_RUSH pattern
  for (const [dateStr, dayTrades] of tradeMap.entries()) {
    const eodTrades = dayTrades.filter(trade => {
      const istTime = toIST(trade.entryDate)
      return istTime.getHours() >= 15 // 15:00 IST
    })
    if (eodTrades.length >= 2) {
      patterns.push({
        pattern: 'EOD_RUSH',
        date: dateStr,
        description: `${eodTrades.length} trades in last 30 minutes of session on ${dateStr}`,
        severity: 'MEDIUM'
      })
    }
  }

  // Check MONDAY_SPIKE pattern
  const mondayTrades = trades.filter(trade => getDayOfWeek(trade.entryDate) === 1)
  if (mondayTrades.length >= 3) {
    const totalDays = new Set(trades.map(t => getDateString(toIST(t.entryDate)))).size
    const avgTradesPerDay = trades.length / totalDays
    const mondayCount = mondayTrades.length
    if (mondayCount > 1.5 * avgTradesPerDay) {
      patterns.push({
        pattern: 'MONDAY_SPIKE',
        date: getDateString(toIST(mondayTrades[0].entryDate)),
        description: `${mondayCount} trades on Monday (1.5x daily average)`,
        severity: 'LOW'
      })
    }
  }

  return patterns.sort((a, b) => b.date.localeCompare(a.date))
}

export async function detectOvertrading(userId: string, lookbackDays = 30): Promise<OvertradingPattern[]> {
  const cutoff = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000)
  const trades = await prisma.trade.findMany({
    where: { userId, entryDate: { gte: cutoff } }
  })

  const dayMap = new Map<string, number>()
  trades.forEach(trade => {
    const dateStr = getDateString(toIST(trade.entryDate))
    dayMap.set(dateStr, (dayMap.get(dateStr) || 0) + 1)
  })

  const dailyCounts = Array.from(dayMap.values())
  const mean = dailyCounts.reduce((a, b) => a + b, 0) / dailyCounts.length
  const variance = dailyCounts.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / dailyCounts.length
  const stdDev = Math.sqrt(variance)

  const patterns: OvertradingPattern[] = []

  for (const [dateStr, count] of dayMap.entries()) {
    if (count > mean + 2 * stdDev) {
      patterns.push({
        pattern: 'EXCESSIVE',
        date: dateStr,
        tradeCount: count,
        avgBenchmark: mean,
        severity: 'HIGH'
      })
    }
  }

  // Reuse EOD_RUSH and MONDAY_SPIKE from revenge detection
  const revengePatterns = await detectRevengeTrading(userId, lookbackDays)
  const eodPatterns = revengePatterns.filter(p => p.pattern === 'EOD_RUSH')
  const mondayPatterns = revengePatterns.filter(p => p.pattern === 'MONDAY_SPIKE')

  eodPatterns.forEach(p => {
    patterns.push({
      pattern: 'EOD_RUSH',
      date: p.date,
      tradeCount: parseInt(p.description.match(/\d+/)![0]),
      avgBenchmark: mean,
      severity: p.severity
    })
  })

  mondayPatterns.forEach(p => {
    patterns.push({
      pattern: 'MONDAY_SPIKE',
      date: p.date,
      tradeCount: parseInt(p.description.match(/\d+/)![0]),
      avgBenchmark: mean,
      severity: p.severity
    })
  })

  return patterns.sort((a, b) => b.date.localeCompare(a.date))
}

export async function computeEmotionCorrelation(userId: string): Promise<EmotionStats> {
  const trades = await prisma.trade.findMany({
    where: { userId, exitPrice: { not: null }, stopPrice: { not: null } }
  })

  const initStats = () => ({ count: 0, wins: 0, totalR: 0, winPnls: 0, lossPnls: 0 })

  const emotionStats: {
    pre: Map<EmotionType, ReturnType<typeof initStats>>,
    during: Map<EmotionType, ReturnType<typeof initStats>>,
    post: Map<EmotionType, ReturnType<typeof initStats>>
  } = {
    pre: new Map(),
    during: new Map(),
    post: new Map()
  }

  trades.forEach(trade => {
    ;['pre', 'during', 'post'].forEach(dim => {
      const emotion = trade[`emotion${dim.charAt(0).toUpperCase() + dim.slice(1)}` as keyof Trade] as EmotionType | null
      if (!emotion) return

      const statsMap = emotionStats[dim as keyof typeof emotionStats]
      if (!statsMap.has(emotion)) statsMap.set(emotion, initStats())
      const stats = statsMap.get(emotion)!

      if (trade.pnl === null) return
      const rMultiple = computeRMultiple(trade.pnl, trade.entryPrice, trade.stopPrice, trade.direction)
      if (rMultiple === 0) return

      stats.count++
      if (rMultiple > 0) {
        stats.wins++
        stats.winPnls += rMultiple
      } else {
        stats.lossPnls += Math.abs(rMultiple)
      }
      stats.totalR += rMultiple
    })
  })

  const buildResult = (statsMap: Map<EmotionType, ReturnType<typeof initStats>>) => {
    const result: Record<string, any> = {}
    for (const [emotion, stats] of statsMap.entries()) {
      if (stats.count < 3) continue
      result[emotion] = {
        count: stats.count,
        winRate: stats.count > 0 ? (stats.wins / stats.count) * 100 : 0,
        avgR: stats.count > 0 ? stats.totalR / stats.count : 0,
        profitFactor: stats.lossPnls > 0 ? stats.winPnls / stats.lossPnls : 0
      }
    }
    return result as Record<EmotionType, any>
  }

  return {
    pre: buildResult(emotionStats.pre),
    during: buildResult(emotionStats.during),
    post: buildResult(emotionStats.post)
  }
}
