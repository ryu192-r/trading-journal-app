import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { prisma } from '@/lib/db';
import { mapBrokerCSV } from '@/lib/parsers/brokerMappers';
import { TradeCreateSchema } from '@/lib/validations/zodSchemas';
import { classifyMarketRegime, computeMAE } from '@/lib/analytics/calculator';

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const content = await file.text();
  const { trades, errors: parseErrors } = mapBrokerCSV(content);

  if (trades.length === 0 && parseErrors.length > 0) {
    return NextResponse.json(
      { error: 'Failed to parse CSV', details: parseErrors },
      { status: 422 }
    );
  }

  let createdCount = 0;
  let failedCount = 0;
  const failedRows: string[] = [];

  await prisma.$transaction(async (tx) => {
    for (const tradeData of trades) {
      try {
        const validated = TradeCreateSchema.parse({
          ...tradeData,
          userId: user.userId,
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
           regime: await classifyMarketRegime(validated.entryDate),
         };

         if (validated.exitPrice) {
           const qty = validated.quantity || 1;
           const diff = validated.direction === 'LONG'
             ? validated.exitPrice - validated.entryPrice
             : validated.entryPrice - validated.exitPrice;
           dbRecord.pnl = diff * qty;
         }

         // Compute and store MAE for closed trades; fail row if MAE computation fails
         if (validated.exitPrice) {
           const maeResult = await computeMAE(dbRecord);
           if (maeResult) {
             dbRecord.mae = maeResult.maeAbs;
           } else {
             throw new Error('MAE computation failed');
           }
         } else {
           dbRecord.mae = null;
         }

         await tx.trade.create({ data: dbRecord });
        createdCount++;
      } catch (err: any) {
        failedCount++;
        const field = err.errors?.[0]?.path?.[0] || 'validation';
        failedRows.push(`Row ${tradeData.symbol || 'unknown'}: ${field} — ${err.message}`);
      }
    }
  });

  return NextResponse.json({
    success: true,
    imported: createdCount,
    failed: failedCount,
    errors: failedCount > 0 ? failedRows : undefined,
    message: `Imported ${createdCount} trades${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
  });
}
