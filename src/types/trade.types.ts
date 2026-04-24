export type Direction = 'LONG' | 'SHORT';
export type SetupType = 'EP' | 'VCP' | 'BREAKOUT' | 'PULLBACK' | 'PARABOLIC_LONG' | 'CUSTOM';

export interface TradeInput {
  symbol: string;
  direction: Direction;
  entryPrice: number;
  exitPrice?: number;
  stopPrice?: number;
  targetPrice?: number;
  quantity?: number;
  entryDate?: Date;
  exitDate?: Date;
  setupType?: SetupType;
  tags?: string[];
  notes?: string;
  screenshotUrl?: string;
}

export interface TradeOutput extends TradeInput {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  pnl?: number | null;
}
