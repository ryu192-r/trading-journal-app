import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { prisma } from '@/lib/db';
import { computeRMultiple, computeMFE } from '@/lib/analytics/calculator';

export async function GET(request: NextRequest) {
  await requireAuth();

  // Fetch closed trades (exitPrice and stopPrice not null)
  const userId = (await requireAuth()).userId;
  const trades = await prisma.trade.findMany({
    where: {
      userId,
      exitPrice: { not: null },
      stopPrice: { not: null },
    },
  });

  // Compute R for each trade
  const rValues: number[] = [];
  for (const t of trades) {
    const r = computeRMultiple(
      t.pnl ?? 0,
      t.entryPrice,
      t.stopPrice!,
      t.direction
    );
    if (r !== null && r !== undefined && !isNaN(r) && (t.exitPrice !== null)) {
      rValues.push(r);
    }
  }

  if (rValues.length === 0) {
    return NextResponse.json({
      histogram: [],
      stats: { count: 0, mean: 0, median: 0, skew: 0 },
      exitEfficiency: { averageMFE: 0, targetHitRate: 0, sampleSize: 0 }
    });
  }

  // Histogram bins: -2R, -1.5R, -1R, -0.5R, 0, +0.5R, +1R, +1.5R, +2R, +2.5R, +3R, +3.5R, +4R, +4.5R, +5R
  const binEdges = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  const labels = [
    '-2R', '-1.5R', '-1R', '-0.5R', '0', '+0.5R', '+1R',
    '+1.5R', '+2R', '+2.5R', '+3R', '+3.5R', '+4R', '+4.5R', '+5R',
  ];
  const histogram = Array(binEdges.length).fill(0);

  for (const r of rValues) {
    // Find bin: count at most in last bin if r >= 5R
    let binIdx = binEdges.length - 1;
    for (let i = 0; i < binEdges.length; i++) {
      if (i === binEdges.length - 1 || r < binEdges[i + 1]) {
        binIdx = i;
        break;
      }
    }
    histogram[binIdx]++;
  }

  // Stats
  const mean = rValues.reduce((a, b) => a + b, 0) / rValues.length;
  const sorted = [...rValues].sort((a, b) => a - b);
  const median =
    rValues.length % 2 === 0
      ? (sorted[rValues.length / 2 - 1] + sorted[rValues.length / 2]) / 2
      : sorted[Math.floor(rValues.length / 2)];
  // Skewness: simple formula: (mean - median) / std could be alternative but we use a simpler measure
  const variance = rValues.reduce((sum, r) => sum + (r - mean) ** 2, 0) / rValues.length;
  const std = Math.sqrt(variance);
  const skew = std > 0 ? ((mean - median) / std) * (Math.sqrt(6) / Math.PI) : 0; // simplified skew proxy

  // Compute exit efficiency for winners with target prices set
  const winnersWithTarget = trades.filter(t => 
    (t.pnl ?? 0) > 0 && t.targetPrice !== null && t.targetPrice !== undefined
  );

  let averageMFE = 0;
  let targetHitRate = 0;
  const sampleSize = winnersWithTarget.length;

  if (winnersWithTarget.length > 0) {
    // Compute MFE for each qualifying winner
    const mfePromises = winnersWithTarget.map(t => computeMFE(t));
    const mfeResults = await Promise.all(mfePromises);
    
    // Calculate average MFE in R units
    const mfeRValues = mfeResults
      .map(r => r.mfeR)
      .filter(r => !isNaN(r));
    if (mfeRValues.length > 0) {
      averageMFE = mfeRValues.reduce((sum, r) => sum + r, 0) / mfeRValues.length;
    }
    
    // Calculate target hit rate
    let hitCount = 0;
    for (let i = 0; i < winnersWithTarget.length; i++) {
      const t = winnersWithTarget[i];
      const mfeAbs = mfeResults[i].mfeAbs;
      const targetDistance = t.direction === 'LONG' 
        ? (t.targetPrice! - t.entryPrice) 
        : (t.entryPrice - t.targetPrice!);
      if (mfeAbs >= targetDistance) {
        hitCount++;
      }
    }
    targetHitRate = hitCount / winnersWithTarget.length;
  }

  return NextResponse.json({
    histogram: labels.map((label, idx) => ({ label, count: histogram[idx] })),
    stats: { count: rValues.length, mean, median, skew },
    exitEfficiency: {
      averageMFE,
      targetHitRate,
      sampleSize
    }
  });
}
