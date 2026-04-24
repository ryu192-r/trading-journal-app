export type Direction = 'LONG' | 'SHORT';
export type SetupType = 'EP' | 'VCP' | 'BREAKOUT' | 'PULLBACK' | 'PARABOLIC_LONG' | 'CUSTOM';
export type EmotionType = 'CALM' | 'FOMO' | 'REVENGE' | 'CONFIDENT' | 'UNCERTAIN' | 'BORED';

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
   emotionPre?: EmotionType;
   emotionDuring?: EmotionType;
   emotionPost?: EmotionType;
   sleepHours?: number;
   fatigueLevel?: number;
   distractions?: string;
}

export interface TradeOutput extends TradeInput {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  pnl?: number | null;
}

export interface ParsedRow {
  success: boolean;
  trade?: TradeInput;
  errors?: string[];
  rowNumber?: number;
}
