import { TradeInput, Direction } from '@/types/trade.types';

export interface ParseResult {
  success: boolean;
  trade?: TradeInput;
  error?: string;
}

// Pattern 1: "bought HDFC at 730, stop 710, target 760"
// Pattern 2: "bought HDFC @ 730, stop 710, target 760"
// Pattern 3: "bought HDFC 730/710/760" (slash notation: entry/stop/target)
// Pattern 4: "sold TCS 3500, SL 3250, target 3400"
// Pattern 5: "long RELIANCE 2400 qty 50"
// Pattern 6: "short INFY 1550 100 shares"

const LONG_PATTERN = /(?:bought|long|buy)\s+([A-Za-z0-9]+)\s+(?:at|@)?\s*(\d+(?:\.\d+)?)(?:\s*,?\s*stop\s+(\d+(?:\.\d+)?))?(?:\s*,?\s*target\s+(\d+(?:\.\d+)?))?(?:\s*,?\s*qty\s+(\d+))?/i;
const LONG_SLASH = /(?:bought|long|buy)\s+([A-Za-z0-9]+)\s+(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?(?:\s+qty\s+(\d+))?/i;

const SHORT_PATTERN = /(?:sold|short|sell)\s+([A-Za-z0-9]+)\s+(?:at|@)?\s*(\d+(?:\.\d+)?)(?:\s*,?\s*SL\s+(\d+(?:\.\d+)?))?(?:\s*,?\s*target\s+(\d+(?:\.\d+)?))?(?:\s*,?\s*qty\s+(\d+))?/i;
const SHORT_SLASH = /(?:sold|short|sell)\s+([A-Za-z0-9]+)\s+(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?(?:\s+qty\s+(\d+))?/i;

export function parseNaturalLanguage(input: string): ParseResult {
  const trimmed = input.trim();

  // Try LONG with "at/@"
  let match = trimmed.match(LONG_PATTERN);
  if (match) {
    const [, symbol, price, stop, target, qty] = match;
    return {
      success: true,
      trade: {
        symbol: symbol.toUpperCase(),
        direction: 'LONG' as Direction,
        entryPrice: parseFloat(price),
        stopPrice: stop ? parseFloat(stop) : undefined,
        targetPrice: target ? parseFloat(target) : undefined,
        quantity: qty ? parseInt(qty, 10) : undefined,
        notes: `NL entry: ${trimmed}`,
        tags: ['NL-Entry'],
      },
    };
  }

  // Try LONG with slash notation (entry/stop/target)
  match = trimmed.match(LONG_SLASH);
  if (match) {
    const [, symbol, price, stop, target, qty] = match;
    return {
      success: true,
      trade: {
        symbol: symbol.toUpperCase(),
        direction: 'LONG' as Direction,
        entryPrice: parseFloat(price),
        stopPrice: stop ? parseFloat(stop) : undefined,
        targetPrice: target ? parseFloat(target) : undefined,
        quantity: qty ? parseInt(qty, 10) : undefined,
        notes: `NL entry: ${trimmed}`,
        tags: ['NL-Entry'],
      },
    };
  }

  // Try SHORT with "SL"
  match = trimmed.match(SHORT_PATTERN);
  if (match) {
    const [, symbol, price, stop, target, qty] = match;
    return {
      success: true,
      trade: {
        symbol: symbol.toUpperCase(),
        direction: 'SHORT' as Direction,
        entryPrice: parseFloat(price),
        stopPrice: stop ? parseFloat(stop) : undefined,
        targetPrice: target ? parseFloat(target) : undefined,
        quantity: qty ? parseInt(qty, 10) : undefined,
        notes: `NL entry: ${trimmed}`,
        tags: ['NL-Entry'],
      },
    };
  }

  // Try SHORT with slash notation
  match = trimmed.match(SHORT_SLASH);
  if (match) {
    const [, symbol, price, stop, target, qty] = match;
    return {
      success: true,
      trade: {
        symbol: symbol.toUpperCase(),
        direction: 'SHORT' as Direction,
        entryPrice: parseFloat(price),
        stopPrice: stop ? parseFloat(stop) : undefined,
        targetPrice: target ? parseFloat(target) : undefined,
        quantity: qty ? parseInt(qty, 10) : undefined,
        notes: `NL entry: ${trimmed}`,
        tags: ['NL-Entry'],
      },
    };
  }

  return {
    success: false,
    error: 'Could not parse. Try: "bought HDFC at 730, stop 710, target 760" or "sold INFY 3500, SL 3400" or "RELIANCE 2400/2350/2500"',
  };
}

// Helper: infer direction from phrase (useful for future extensions)
export function inferDirectionFromPhrase(phrase: string): 'LONG' | 'SHORT' | null {
  if (/bought|long|buy/i.test(phrase)) return 'LONG';
  if (/sold|short|sell/i.test(phrase)) return 'SHORT';
  return null;
}
