import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { prisma } from '@/lib/db';
import { computeRMultiple, computeSharpe, computeSortino, computeMaxDrawdown, computeRecoveryFactor } from '@/lib/analytics/calculator';

export async function GET(request: NextRequest) {
  await requireAuth();
  const userId = (await requireAuth()).userId;

  // Fetch closed trades with exitPrice and stopPrice
  const trades = await prisma.trade.findMany({
    where: {
      userId,
      exitPrice: { not: null },
      stopPrice: { not: null },
    },
    orderBy: { exitDate: 'asc' },
  });

  // Build R returns (each trade as 1 R unit converted to % risk) to compute ratios
  const rReturns: number[] = [];
  for (const t of trades) {
    const r = computeRMultiple(
      t.pnl ?? 0,
      t.entryPrice,
      t.stopPrice!,
      t.direction
    );
    if (!isNaN(r) && r !== null) {
      rReturns.push(r);
    }
  }

  // Convert R returns to percentage returns for Sharpe/Sortino:
  // Each R is already % of risk; we keep as decimal-like R (e.g., 2R = +2, -1R = -1) and standardize
  const returns = rReturns; // treat R as return unit for ratios (since they are per-risk units)

  // Sharpe ratio: mean/std
  const sharpe = computeSharpe(returns);
  const sortino = computeSortino(returns);

  // Build equity curve from cumulative R to get max drawdown
  let equity = [0]; // start at 0 equity (cumulative R)
  for (const r of returns) {
    equity.push(equity[equity.length - 1] + r);
  }
  const maxDrawdown = computeMaxDrawdown(equity);
  const totalProfit = rReturns.reduce((a, b) => a + b, 0);
  const recoveryFactor = computeRecoveryFactor(totalProfit, maxDrawdown);

  return NextResponse.json({
    sharpe,
    sortino,
    maxDrawdown,
    recoveryFactor,
    tradesCount: rReturns.length,
  });
}
