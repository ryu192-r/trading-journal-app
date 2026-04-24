import yahooFinance from 'yahoo-finance2';

interface YahooCandle {
  date: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
}

interface YahooQuote {
  regularMarketPrice: number | null;
}

/**
 * Maps Indian market symbols to Yahoo Finance tickers.
 * NIFTY 50 → ^NSEI, BANKNIFTY → ^NSEBANK, SENSEX → ^BSESN
 * Other NSE symbols → SYMBOL.NS
 */
export function toYahooTicker(symbol: string): string {
  const s = symbol.toUpperCase().trim();
  if (['NIFTY', 'NIFTY 50'].includes(s)) return '^NSEI';
  if (s === 'BANKNIFTY') return '^NSEBANK';
  if (s === 'SENSEX') return '^BSESN';
  return `${s}.NS`;
}

/**
 * Fetches daily OHLC candles for a given symbol and date range.
 * Returns array of { date, open, high, low, close }.
 */
export async function getDailyOHLC(
  symbol: string,
  start: Date,
  end: Date
): Promise<Array<{ date: Date; open: number; high: number; low: number; close: number }>> {
  const ticker = toYahooTicker(symbol);
  const raw = await yahooFinance.historical(ticker, { start, end, interval: '1d' }) as YahooCandle[];
  return raw.map(r => ({
    date: new Date(r.date),
    open: r.open!,
    high: r.high!,
    low: r.low!,
    close: r.close!,
  }));
}

/**
 * Gets the minimum low and maximum high price within a date range.
 * Useful for MAE/MFE calculations on a per-trade basis.
 */
export async function getPriceRange(
  symbol: string,
  start: Date,
  end: Date
): Promise<{ min: number; max: number }> {
  const candles = await getDailyOHLC(symbol, start, end);
  const lows = candles.map(c => c.low);
  const highs = candles.map(c => c.high);
  return { min: Math.min(...lows), max: Math.max(...highs) };
}

/**
 * Fetches the current India VIX value.
 * Used for market regime classification.
 */
export async function getLatestVIX(): Promise<number> {
  const q = await yahooFinance.quote('^INDIAVIX') as YahooQuote;
  return q.regularMarketPrice ?? 0;
}
