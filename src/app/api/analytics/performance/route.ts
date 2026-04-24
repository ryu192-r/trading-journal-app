import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { prisma } from '@/lib/db';
import { computeRMultiple } from '@/lib/analytics/calculator';

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

function computeSharpe(returns: number[]): number {
  if (returns.length === 0) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / returns.length;
  const std = Math.sqrt(variance);
  if (std === 0) return 0;
  return mean / std * Math.sqrt(252); // annualized
}

function computeSortino(returns: number[]): number {
  if (returns.length === 0) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const downsideSq = returns.filter(r => r < 0).reduce((sum, r) => sum + r ** 2, 0);
  const downsideDev = Math.sqrt(downsideSq / returns.length);
  if (downsideDev === 0) return 0;
  return mean / downsideDev * Math.sqrt(252);
}

function computeMaxDrawdown(equity: number[]): number {
  if (equity.length === 0) return 0;
  let peak = equity[0];
  let maxDD = 0;
  for (const value of equity) {
    if (value > peak) peak = value;
    const dd = (peak - value) / (peak !== 0 ? peak : 1);
    if (dd > maxDD) maxDD = dd;
  }
  return maxDD;
}

function computeRecoveryFactor(totalProfit: number, maxDrawdown: number): number {
  if (maxDrawdown === 0) return totalProfit > 0 ? 1 : 0;
  return totalProfit / maxDrawdown;
}
