import { parse } from 'csv-parse/sync';
import { TradeInput, ParsedRow } from '@/types/trade.types';

export function parseCSV(content: string): ParsedRow[] {
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  return records.map((row, index) => {
    const rawDirection = row['Buy/Sell'] || row['transaction_type'] || row['Trade Type'] || '';
    const isSell = rawDirection.toUpperCase() === 'SELL';
    const direction = isSell ? 'SHORT' : 'LONG';

    const symbol = String(row['Symbol'] || row['symbol'] || '').replace(/\s+/g, '').toUpperCase();
    const entryPrice = parseFloat(row['Average Price'] || row['trade_price'] || row['Price'] || '0');
    const quantity = row['Quantity'] ? parseInt(row['Quantity'], 10) : undefined;

    let entryDate: Date | undefined;
    const tradeDate = row['Trade Date'] || row['trade_date'] || row['Trades Date'];
    const tradeTime = row['Trades Time'] || row['Order Execution Time'];
    if (tradeDate) {
      entryDate = tradeTime ? new Date(`${tradeDate} ${tradeTime}`) : new Date(tradeDate);
    }

    return {
      success: true,
      trade: {
        symbol,
        direction,
        entryPrice,
        quantity,
        entryDate,
      },
      rowNumber: index + 2,
    };
  });
}
