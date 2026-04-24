import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { prisma } from '@/lib/db';
import { computeRMultiple } from '@/lib/analytics/calculator';

export async function GET(request: NextRequest) {
  await requireAuth();
  const userId = (await requireAuth()).userId;

  // Fetch closed trades with setupType
  const trades = await prisma.trade.findMany({
    where: {
      userId,
      exitPrice: { not: null },
      stopPrice: { not: null },
      setupType: { not: null },
    },
  });

  // Group trades by setupType
  const groups: Record<string, typeof trades> = {};
  for (const t of trades) {
    const key = t.setupType!;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }

  // Compute metrics per setup
  const results = Object.entries(groups).map(([setupType, list]) => {
    let count = 0;
    let wins = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    let bestR = -Infinity;
    let worstR = Infinity;
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
      if (r > bestR) bestR = r;
      if (r < worstR) worstR = r;
    }

    const winRate = count > 0 ? wins / count : 0;
    const avgR = rValues.length > 0 ? rValues.reduce((a, b) => a + b, 0) / rValues.length : 0;
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : (totalProfit > 0 ? 1 : 0);

    // Allocation recommendation
    let recommendation: string;
    if (avgR > 0) {
      recommendation = 'Consider increasing weight';
    } else if (avgR < 0) {
      recommendation = 'Avoid or reduce';
    } else {
      recommendation = 'Maintain current allocation';
    }

    return {
      setupType: setupType,
      count,
      wins,
      losses: count - wins,
      winRate,
      avgR,
      profitFactor,
      bestTrade: bestR === -Infinity ? 0 : bestR,
      worstTrade: worstR === Infinity ? 0 : worstR,
      recommendation,
    };
  });

  return NextResponse.json(results);
}
