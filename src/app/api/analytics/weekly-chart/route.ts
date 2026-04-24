import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { prisma } from '@/lib/db';
import { getDailyOHLC } from '@/lib/market/dataFetcher';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  const userId = authResult.userId;

  // Parse week query param (YYYY-WW), default to current week Monday
  const { searchParams } = new URL(request.url);
  const weekParam = searchParams.get('week');
  let weekStart: Date;
  if (weekParam) {
    // Parse YYYY-WW to Monday of that week
    const [yearStr, weekStr] = weekParam.split('-');
    const year = parseInt(yearStr, 10);
    const weekNum = parseInt(weekStr, 10);
    // Compute Monday of given week number
    weekStart = weekStartFromWeekNumber(year, weekNum);
  } else {
    weekStart = getMonday(new Date());
  }

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6); // Sunday

  // Fetch NIFTY daily candles
  const candles = await getDailyOHLC('NIFTY', weekStart, weekEnd);

  // Fetch prior week's candles to compute week-over-week trend
  const priorWeekStart = new Date(weekStart);
  priorWeekStart.setDate(priorWeekStart.getDate() - 7);
  const priorWeekEnd = new Date(weekStart);
  priorWeekEnd.setDate(priorWeekEnd.getDate() - 1);
  const priorWeekCandles = await getDailyOHLC('NIFTY', priorWeekStart, priorWeekEnd);

  // Compute market trend (week-over-week close change)
  const weekClose = candles.length > 0 ? candles[candles.length - 1].close : null;
  const priorWeekClose = priorWeekCandles.length > 0 ? priorWeekCandles[priorWeekCandles.length - 1].close : null;
  let trendUp: boolean | null = null;
  if (weekClose !== null && priorWeekClose !== null) {
    trendUp = weekClose > priorWeekClose;
  }

  // Fetch user's trades with entryDate in the week
  const trades = await prisma.trade.findMany({
    where: {
      userId,
      entryDate: { gte: weekStart, lte: weekEnd },
    },
  });

  // Build trade markers
  interface TradeMarker {
    date: Date;
    type: 'entry' | 'exit';
    direction: string;
    price: number;
    trend: 'with' | 'counter';
  }

  const tradeMarkers: TradeMarker[] = trades.map((t) => {
    // Determine trend alignment: with-trend if trade direction matches market trend
    let trend: 'with' | 'counter' = 'counter'; // Default to counter-trend if trend can't be determined
    if (trendUp !== null) {
      const isLong = t.direction.toUpperCase() === 'LONG';
      const isMarketUp = trendUp;
      // With-trend: long trade when market up, short trade when market down
      if ((isLong && isMarketUp) || (!isLong && !isMarketUp)) {
        trend = 'with';
      }
    }
    return {
      date: t.entryDate,
      type: 'entry',
      direction: t.direction,
      price: t.entryPrice,
      trend,
    };
  });

  // Also include exit markers if exitDate is within the week
  for (const t of trades) {
    if (t.exitDate && t.exitDate >= weekStart && t.exitDate <= weekEnd) {
      let trend: 'with' | 'counter' = 'counter';
      if (trendUp !== null) {
        const isLong = t.direction.toUpperCase() === 'LONG';
        const isMarketUp = trendUp;
        if ((isLong && isMarketUp) || (!isLong && !isMarketUp)) {
          trend = 'with';
        }
      }
      tradeMarkers.push({
        date: t.exitDate,
        type: 'exit',
        direction: t.direction,
        price: t.exitPrice!,
        trend,
      });
    }
  }

  // Sort markers by date
  tradeMarkers.sort((a, b) => a.date.getTime() - b.date.getTime());

  return NextResponse.json({
    candles: candles.map(c => ({
      date: c.date,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    })),
    tradeMarkers,
  });
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function weekStartFromWeekNumber(year: number, week: number): Date {
  // ISO 8601: week 1 is the week with the first Thursday of the year
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const isoWeekStart = new Date(simple);
  isoWeekStart.setDate(simple.getDate() - ((dow + 6) % 7));
  isoWeekStart.setHours(0, 0, 0, 0);
  return isoWeekStart;
}
