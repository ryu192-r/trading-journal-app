import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { prisma } from '@/lib/db';
import { computeMFE } from '@/lib/analytics/calculator';

export async function GET(request: NextRequest) {
  await requireAuth();
  const userId = (await requireAuth()).userId;

  // Fetch closed trades with targetPrice
  const trades = await prisma.trade.findMany({
    where: {
      userId,
      exitPrice: { not: null },
      targetPrice: { not: null },
    },
  });

  const mfeResults = await Promise.all(
    trades.map(async (t) => computeMFE(t))
  );

  const validResults = mfeResults.filter(r => r !== null);
  const mfeRValues = validResults.map(r => r!.mfeR);

  // Determine target hit rate for winners only
  let hitCount = 0;
  let winnerCount = 0;
  for (let idx = 0; idx < validResults.length; idx++) {
    const result = validResults[idx];
    const trade = trades[idx];
    if (trade.pnl && trade.pnl > 0) {
      winnerCount++;
      const expectedGain = trade.direction === 'LONG'
        ? trade.targetPrice! - trade.entryPrice
        : trade.entryPrice - trade.targetPrice!;
      if (result.mfeAbs >= expectedGain * 0.95) { // allow 5% tolerance
        hitCount++;
      }
    }
  }

  const targetHitRate = winnerCount > 0 ? hitCount / winnerCount : 0;
  const averageMFE = mfeRValues.length > 0
    ? mfeRValues.reduce((a, b) => a + b, 0) / mfeRValues.length
    : 0;

  return NextResponse.json({
    tradesCount: mfeRValues.length,
    averageMFE,
    targetHitRate,
  });
}
