import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { prisma } from '@/lib/db';
import { computeMAE } from '@/lib/analytics/calculator';

export async function GET(request: NextRequest) {
  await requireAuth();
  const userId = (await requireAuth()).userId;

  // Fetch closed trades with stopPrice
  const trades = await prisma.trade.findMany({
    where: {
      userId,
      exitPrice: { not: null },
      stopPrice: { not: null },
    },
  });

  const maeResults = await Promise.all(
    trades.map(async (t) => computeMAE(t))
  );

  const validResults = maeResults.filter(r => r !== null);
  const maeRValues = validResults.map(r => r!.maeR);

  // Collect MAE percentages for winners
  const winnerMAEAbsPercentiles: number[] = [];
  for (let idx = 0; idx < validResults.length; idx++) {
    const result = validResults[idx];
    const trade = trades[idx];
    if (trade.pnl && trade.pnl > 0) {
      winnerMAEAbsPercentiles.push(result.maeAbs / trade.entryPrice);
    }
  }

  // Build histogram: bins from -2R to 0 step 0.2R (inclusive)
  const binStep = 0.2;
  const minBin = -2;
  const maxBin = 0;
  const bins = [];
  const labels = [];
  let edge = minBin;
  while (edge < maxBin) {
    labels.push(edge.toFixed(1) + 'R');
    bins.push(0);
    edge += binStep;
  }
  labels.push('0R');
  bins.push(0);

  for (const maeR of maeRValues) {
    // Clip to range [minBin, maxBin]
    let binIdx = Math.floor((maeR - minBin) / binStep);
    if (binIdx < 0) binIdx = 0;
    if (binIdx >= bins.length) binIdx = bins.length - 1;
    bins[binIdx]++;
  }

  const histogram = labels.map((label, idx) => ({ label, count: bins[idx] }));

  // Compute 95th percentile of winner MAE % to recommend stop
  let stopRecommendation = 'Insufficient data';
  if (winnerMAEAbsPercentiles.length > 0) {
    winnerMAEAbsPercentiles.sort((a, b) => a - b);
    const idx95 = Math.floor(winnerMAEAbsPercentiles.length * 0.95);
    const pct = winnerMAEAbsPercentiles[idx95] * 100; // convert to percentage
    stopRecommendation = `Set stop at ${pct.toFixed(2)}% — 95% of winners never went below this MAE`;
  }

  return NextResponse.json({
    histogram,
    sampleSize: maeRValues.length,
    winnersCount: winnerMAEAbsPercentiles.length,
    stopRecommendation,
  });
}
