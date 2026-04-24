import { parseCSV } from './csvParser';
import { TradeInput } from '@/types/trade.types';

type Broker = 'zerodha' | 'dhan' | 'angelone' | 'icicidirect';

const BROKER_HEADERS: Record<Broker, string[][]> = {
  zerodha: [
    ['Symbol', 'Trade Type', 'Buy/Sell', 'Quantity', 'Average Price', 'Trade Date', 'Product', 'Order Execution Time', 'Exchange']
  ],
  dhan: [
    ['symbol', 'transaction_type', 'quantity', 'trade_price', 'trade_date', 'order_id', 'exchange', 'segment']
  ],
  angelone: [
    ['Script', 'Buy/Sell', 'Quantity', 'Trades Date', 'Trades Time', 'Price', 'Net Amount']
  ],
  icicidirect: [
    ['Trade No', 'Symbol', 'Buy/Sell', 'Quantity', 'Trade Price', 'Trade Date', 'Order Number', 'Status']
  ],
};

function detectBroker(headers: string[]): Broker | null {
  for (const [broker, patterns] of Object.entries(BROKER_HEADERS)) {
    for (const pattern of patterns) {
      if (pattern.every(h => headers.includes(h))) {
        return broker as Broker;
      }
    }
  }
  return null;
}

function mapZerodha(row: Record<string, string>): TradeInput | null {
  const symbol = (row['Symbol'] || '').replace(/\s+/g, '').toUpperCase();
  if (!symbol) return null;

  const isSell = (row['Buy/Sell'] || '').toUpperCase() === 'SELL';
  const entryPrice = parseFloat(row['Average Price'] || '0');
  const quantity = row['Quantity'] ? parseInt(row['Quantity'], 10) : undefined;
  const entryDate = row['Trade Date'] ? new Date(row['Trade Date']) : undefined;

  // Build tags from broker-specific fields
  const tags: string[] = [];
  if (row['Product']) tags.push(row['Product']);
  if (row['Exchange']) tags.push(row['Exchange']);

  return {
    symbol,
    direction: isSell ? 'SHORT' : 'LONG',
    entryPrice,
    quantity,
    entryDate,
    tags: tags.length > 0 ? tags : undefined,
    notes: 'Imported from Zerodha',
  };
}

function mapDhan(row: Record<string, string>): TradeInput | null {
  const symbol = (row['symbol'] || '').toUpperCase();
  if (!symbol) return null;

  const txType = (row['transaction_type'] || '').toUpperCase();
  const isSell = txType.includes('SELL');
  const entryPrice = parseFloat(row['trade_price'] || '0');
  const quantity = row['quantity'] ? parseInt(row['quantity'], 10) : undefined;
  const entryDate = row['trade_date'] ? new Date(row['trade_date']) : undefined;

  return {
    symbol,
    direction: isSell ? 'SHORT' : 'LONG',
    entryPrice,
    quantity,
    entryDate,
    tags: ['DHAN'],
  };
}

function mapAngelOne(row: Record<string, string>): TradeInput | null {
  const symbol = (row['Script'] || '').toUpperCase();
  if (!symbol) return null;

  const isSell = (row['Buy/Sell'] || '').toUpperCase() === 'SELL';
  const entryPrice = parseFloat(row['Price'] || '0');
  const quantity = row['Quantity'] ? parseInt(row['Quantity'], 10) : undefined;
  const dateStr = row['Trades Date'] || '';
  const timeStr = row['Trades Time'] || '00:00:00';
  const entryDate = dateStr ? new Date(`${dateStr} ${timeStr}`) : undefined;

  return {
    symbol,
    direction: isSell ? 'SHORT' : 'LONG',
    entryPrice,
    quantity,
    entryDate,
    notes: 'AngelOne trade',
  };
}

function mapICICIDirect(row: Record<string, string>): TradeInput | null {
  const symbol = (row['Symbol'] || '').toUpperCase();
  if (!symbol) return null;

  const isSell = (row['Buy/Sell'] || '').toUpperCase() === 'SELL';
  const entryPrice = parseFloat(row['Trade Price'] || '0');
  const quantity = row['Quantity'] ? parseInt(row['Quantity'], 10) : undefined;
  const entryDate = row['Trade Date'] ? new Date(row['Trade Date']) : undefined;

  return {
    symbol,
    direction: isSell ? 'SHORT' : 'LONG',
    entryPrice,
    quantity,
    entryDate,
  };
}

const BROKER_MAPPERS: Record<Broker, (row: Record<string, string>) => TradeInput | null> = {
  zerodha: mapZerodha,
  dhan: mapDhan,
  angelone: mapAngelOne,
  icicidirect: mapICICIDirect,
};

export function mapBrokerCSV(content: string): { trades: TradeInput[]; errors: string[] } {
  const rawRows = parseCSV(content);
  if (rawRows.length === 0) {
    return { trades: [], errors: ['Empty CSV or invalid format'] };
  }

  const headers = Object.keys(rawRows[0]);
  const broker = detectBroker(headers);

  if (!broker) {
    return {
      trades: [],
      errors: ['Unknown broker CSV format — supported: Zerodha, Dhan, AngelOne, ICICI Direct'],
    };
  }

  const mapper = BROKER_MAPPERS[broker];
  const trades: TradeInput[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];
    const lineNum = i + 2; // account for header row
    try {
      const trade = mapper(row);
      if (trade) {
        trades.push(trade);
      } else {
        errors.push(`Row ${lineNum}: failed to map required fields (symbol missing)`);
      }
    } catch (e: any) {
      errors.push(`Row ${lineNum}: ${e.message || 'Mapping error'}`);
    }
  }

  return { trades, errors };
}

export { detectBroker };

