import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { prisma } from '@/lib/db';
import { classifyMarketRegime } from '@/lib/analytics/calculator';
import { computeRMultiple } from '@/lib/analytics/calculator';

export async function GET(request: NextRequest) {
  await requireAuth();
  const userId = (await requireAuth()).userId;

  // Fetch all closed trades
  const trades = await prisma.trade.findMany({
    where: {
      userId,
      exitPrice: { not: null },
      stopPrice: { not: null },
    },
  });

  // Group by regime; compute regime per trade using classifyMarketRegime
  // Note: trades might already have regime if created through updated endpoints
  const regimeGroups: Record<string, typeof trades> = {};
  for (const t of trades) {
    const regime = t.regime || (await classifyMarketRegime(t.entryDate));
    if (!regimeGroups[regime]) regimeGroups[regime] = [];
    regimeGroups[regime].push(t);
  }

  const results = Object.entries(regimeGroups).map(([regime, list]) => {
    let count = 0;
    let wins = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    const rValues: number[] = [];

    for (const t of list) {
      const r = computeRMultiple(
        t.pnl ?? 0,
        t.entryPrice,
        t.stopPrice!,
        t.direction
      );
      rValues.push(r);
      count++;
      if (r > 0) {
        wins++;
        totalProfit += r;
      } else {
        totalLoss += Math.abs(r);
      }
    }

    const winRate = count > 0 ? wins / count : 0;
    const avgR = rValues.length > 0 ? rValues.reduce((a, b) => a + b, 0) / rValues.length : 0;
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : (totalProfit > 0 ? 1 : 0);

    // Adaptive rule text
    const rule =
      avgR < 0 || winRate < 0.4
        ? `Avoid trading in ${regime}`
        : `Can trade ${regime} — edge positive`;

    return {
      regime,
      count,
      wins,
      losses: count - wins,
      winRate,
      avgR,
      profitFactor,
      rule,
    };
  });

  return NextResponse.json(results);
}
