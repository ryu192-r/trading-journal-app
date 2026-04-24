import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { prisma } from '@/lib/db';
import { parseNaturalLanguage } from '@/lib/parsers/nlParser';
import { TradeCreateSchema } from '@/lib/validations/zodSchemas';

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  const { text } = await request.json();

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Text field required' }, { status: 400 });
  }

  const parsed = parseNaturalLanguage(text);
  if (!parsed.success || !parsed.trade) {
    return NextResponse.json(
      { error: parsed.error || 'Parse failed', example: 'Try: "bought HDFC at 730, stop 710, target 760"' },
      { status: 422 }
    );
  }

  try {
    const validated = TradeCreateSchema.parse({
      ...parsed.trade,
      userId: user.userId,
      entryDate: new Date(),
    });

    const dbRecord: any = {
      symbol: validated.symbol,
      direction: validated.direction,
      entryPrice: validated.entryPrice,
      userId: user.userId,
      entryDate: validated.entryDate,
      exitPrice: validated.exitPrice,
      stopPrice: validated.stopPrice,
      targetPrice: validated.targetPrice,
      quantity: validated.quantity,
      setupType: validated.setupType,
      tags: validated.tags,
      notes: validated.notes,
      screenshotUrl: validated.screenshotUrl,
    };

    if (validated.exitPrice) {
      const qty = validated.quantity || 1;
      const diff = validated.direction === 'LONG'
        ? validated.exitPrice - validated.entryPrice
        : validated.entryPrice - validated.exitPrice;
      dbRecord.pnl = diff * qty;
    }

    const trade = await prisma.trade.create({ data: dbRecord });
    return NextResponse.json({ trade }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Validation failed', details: err.errors },
      { status: 400 }
    );
  }
}
