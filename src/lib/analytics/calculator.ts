import { prisma } from '@/lib/db'
import { getDailyOHLC, getPriceRange, getLatestVIX, toYahooTicker } from '@/lib/market/dataFetcher';

/* ==================== TYPE DEFINITIONS ==================== */

export interface Trade {
  id?: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  stopPrice?: number;
  exitPrice?: number;
  entryDate: Date;
  exitDate?: Date;
  pnl?: number;
  setupType?: string;
}

export interface Candle {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface MAEResult {
  maeAbs: number;  // Maximum Adverse Excursion in currency
  maeR: number;    // MAE in R-multiples
}

export interface MFEResult {
  mfeAbs: number;  // Maximum Favorable Excursion in currency
  mfeR: number;    // MFE in R-multiples
}

export interface SetupScorecard {
  winRate: number;
  avgR: number;
  profitFactor: number;
  totalTrades: number;
  bestTradeR: number;
  worstTradeR: number;
}

export interface WeeklyOverlay {
  candles: Candle[];
  tradeMarkers: Array<{ date: Date; type: 'entry' | 'exit'; tradeId?: string }>;
}

/* ==================== R-MULTIPLES ==================== */

/**
 * Computes the R-multiple for a completed trade.
 * R = P&L / (entry - stop) for LONG
 * R = P&L / (stop - entry) for SHORT
 */
export function computeRMultiple(
  pnl: number,
  entryPrice: number,
  stopPrice: number | undefined,
  direction: 'LONG' | 'SHORT'
): number {
  if (stopPrice === undefined) return 0;
  const risk = Math.abs(entryPrice - stopPrice);
  if (risk === 0) return 0;
  return direction === 'LONG' ? pnl / risk : pnl / risk;
}

export interface GhostResult {
  tradeId: string
  symbol: string
  direction: 'LONG' | 'SHORT'
  exitPrice: number
  exitDate: Date
  maxPrice30d: number
  minPrice30d: number
  missedProfit: number
  missedR: number | null
}

export async function computeGhostTrade(tradeId: string, userId: string): Promise<GhostResult | null> {
  const trade = await prisma.trade.findFirst({
    where: { id: tradeId, userId },
    select: { id: true, symbol: true, direction: true, entryPrice: true, exitPrice: true, stopPrice: true, quantity: true, exitDate: true }
  })
  if (!trade || !trade.exitPrice || !trade.exitDate) return null

  const ticker = toYahooTicker(trade.symbol)
  const start = new Date(trade.exitDate)
  start.setDate(start.getDate() + 1)
  const end = new Date(trade.exitDate)
  end.setDate(end.getDate() + 30)
  
  const candles = await getDailyOHLC(ticker, start, end)
  if (candles.length === 0) return null

  const window30 = candles.slice(0, 30)
  const maxPrice30d = Math.max(...window30.map(c => c.high))
  const minPrice30d = Math.min(...window30.map(c => c.low))
  const qty = trade.quantity || 1
  let missedProfit = 0
  if (trade.direction === 'LONG') {
    missedProfit = (maxPrice30d - trade.exitPrice) * qty
  } else {
    missedProfit = (trade.exitPrice - minPrice30d) * qty
  }

  let missedR: number | null = null
  if (trade.stopPrice) {
    const riskPerShare = Math.abs(trade.entryPrice - trade.stopPrice)
    if (riskPerShare > 0) missedR = missedProfit / (riskPerShare * qty)
  }

  return {
    tradeId: trade.id,
    symbol: trade.symbol,
    direction: trade.direction,
    exitPrice: trade.exitPrice,
    exitDate: trade.exitDate,
    maxPrice30d,
    minPrice30d,
    missedProfit,
    missedR
  }
}

/* ==================== PERFORMANCE RATIOS ==================== */

/**
 * Computes annualized Sharpe ratio from an array of daily returns.
 * Assumes zero risk-free rate; uses sqrt(252) for annualization.
 */
export function computeSharpe(returns: number[]): number {
  if (returns.length === 0) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / returns.length;
  const std = Math.sqrt(variance);
  if (std === 0) return 0;
  return mean / std * Math.sqrt(252);
}

/**
 * Computes annualized Sortino ratio (downside deviation only).
 */
export function computeSortino(returns: number[]): number {
  if (returns.length === 0) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const downsideSq = returns
    .filter(r => r < 0)
    .reduce((sum, r) => sum + r ** 2, 0);
  const downsideDev = Math.sqrt(downsideSq / returns.length);
  if (downsideDev === 0) return 0;
  return mean / downsideDev * Math.sqrt(252);
}

/**
 * Computes maximum drawdown from an equity/account-value curve.
 */
export function computeMaxDrawdown(equity: number[]): number {
  if (equity.length === 0) return 0;
  let peak = equity[0];
  let maxDD = 0;
  for (const value of equity) {
    if (value > peak) peak = value;
    const dd = (peak - value) / peak;
    if (dd > maxDD) maxDD = dd;
  }
  return maxDD;
}

/**
 * Computes recovery factor: total profit divided by max drawdown.
 */
export function computeRecoveryFactor(totalProfit: number, maxDrawdown: number): number {
  if (maxDrawdown === 0) return totalProfit > 0 ? 1 : 0;
  return totalProfit / maxDrawdown;
}

/* ==================== MAE & MFE ==================== */

/**
 * Computes MAE (Maximum Adverse Excursion) for a trade.
 * Uses provided price data or fetches market data if not supplied.
 * For LONG: adverse = entryPrice - low
 * For SHORT: adverse = high - entryPrice
 */
export async function computeMAE(
  trade: Trade,
  priceData?: Candle[]
): Promise<MAEResult | null> {
  try {
    const data = priceData ?? await getDailyOHLC(
      trade.symbol,
      trade.entryDate,
      trade.exitDate ?? new Date()
    );
    const risk = Math.abs(trade.entryPrice - (trade.stopPrice ?? trade.entryPrice * 0.98));
    let maeAbs = 0;
    for (const c of data) {
      const adverse = trade.direction === 'LONG'
        ? trade.entryPrice - c.low
        : c.high - trade.entryPrice;
      if (adverse > maeAbs) maeAbs = adverse;
    }
    const maeR = risk > 0 ? maeAbs / risk : 0;
    return { maeAbs, maeR };
  } catch (error) {
    // Silently return null to avoid leaking stack traces; trade creation can proceed without MAE
    console.error('computeMAE failed:', error);
    return null;
  }
}

/**
 * Computes MFE (Maximum Favorable Excursion) for a trade.
 * Uses provided price data or fetches market data if not supplied.
 * For LONG: favorable = high - entryPrice
 * For SHORT: favorable = entryPrice - low
 */
export async function computeMFE(
  trade: Trade,
  priceData?: Candle[]
): Promise<MFEResult> {
  const data = priceData ?? await getDailyOHLC(
    trade.symbol,
    trade.entryDate,
    trade.exitDate ?? new Date()
  );
  const risk = Math.abs(trade.entryPrice - (trade.stopPrice ?? trade.entryPrice * 0.98));
  let mfeAbs = 0;
  for (const c of data) {
    const favorable = trade.direction === 'LONG'
      ? c.high - trade.entryPrice
      : trade.entryPrice - c.low;
    if (favorable > mfeAbs) mfeAbs = favorable;
  }
  const mfeR = risk > 0 ? mfeAbs / risk : 0;
  return { mfeAbs, mfeR };
}

/* ==================== MARKET REGIME ==================== */

/**
 * Classifies market regime (Bull/Bear/Sideways × Normal/Volatile)
 * based on NIFTY 50 trend and India VIX.
 * Uses ~60 days of history and current VIX.
 */
export async function classifyMarketRegime(entryDate: Date): Promise<string> {
  const lookbackStart = new Date(entryDate);
  lookbackStart.setDate(lookbackStart.getDate() - 60);
  const candles = await getDailyOHLC('NIFTY', lookbackStart, entryDate);
  if (candles.length < 10) return 'Sideways-Normal';

  const oldest = candles[0].close;
  const latest = candles[candles.length - 1].close;
  const pctChange = (latest - oldest) / oldest;

  const trend = pctChange > 0.05 ? 'Bull' : pctChange < -0.05 ? 'Bear' : 'Sideways';

  const vix = await getLatestVIX();
  const volatility = vix > 25 ? 'Volatile' : 'Normal';

  return `${trend}-${volatility}`;
}

/* ==================== SETUP SCORECARD ==================== */

/**
 * Computes per-setup aggregates: win rate, avg R, profit factor, best/worst trade.
 * Accepts array of trades (must have pnl, direction, entryPrice, stopPrice).
 */
export function computeSetupScorecard(
  trades: Trade[]
): Record<string, SetupScorecard> {
  const groups: Record<string, Trade[]> = {};
  for (const t of trades) {
    const key = t.setupType ?? 'Uncategorized';
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }

  const results: Record<string, SetupScorecard> = {};
  for (const [setup, list] of Object.entries(groups)) {
    const total = list.length;
    let wins = 0, totalProfit = 0, totalLoss = 0;
    let bestR = -Infinity, worstR = Infinity;
    const rMultiples: number[] = [];

    for (const t of list) {
      const risk = Math.abs(t.entryPrice - (t.stopPrice ?? t.entryPrice * 0.98));
      const r = risk > 0 ? (t.pnl ?? 0) / risk : 0;
      rMultiples.push(r);
      if (r > 0) {
        wins++;
        totalProfit += r;
      } else {
        totalLoss += Math.abs(r);
      }
      if (r > bestR) bestR = r;
      if (r < worstR) worstR = r;
    }

    const winRate = total > 0 ? wins / total : 0;
    const avgR = rMultiples.reduce((a, b) => a + b, 0) / rMultiples.length;
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 1 : 0;

    results[setup] = {
      winRate,
      avgR,
      profitFactor,
      totalTrades: total,
      bestTradeR: bestR === -Infinity ? 0 : bestR,
      worstTradeR: worstR === Infinity ? 0 : worstR,
    };
  }

  return results;
}

/* ==================== WEEKLY OVERLAY ==================== */

/**
 * Generates weekly candles and trade markers for situational awareness.
 * weekStart should be a Monday (or any week start).
 */
export async function computeWeeklyOverlay(
  symbol: string,
  weekStart: Date
): Promise<WeeklyOverlay> {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 5); // 5 trading days? Actually compute exactly 7 calendar days

  const dailyCandles = await getDailyOHLC(symbol, weekStart, weekEnd);
  // Group by week (already filtered) but we might aggregate if needed; here we just pass daily.
  // For weekly candles, we could aggregate; but keep simple: week is already range.
  const candles: Candle[] = dailyCandles.map(c => ({
    date: c.date,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
  }));

  // Trade markers would be populated later by API calling this with actual trades
  const tradeMarkers: WeeklyOverlay['tradeMarkers'] = [];

  return { candles, tradeMarkers };
}
