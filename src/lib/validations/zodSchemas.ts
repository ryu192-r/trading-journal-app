import { z } from 'zod';

export const DirectionEnum = z.enum(['LONG', 'SHORT']);
export type Direction = z.infer<typeof DirectionEnum>;

export const SetupTypeEnum = z.enum(['EP', 'VCP', 'BREAKOUT', 'PULLBACK', 'PARABOLIC_LONG', 'CUSTOM']);
export type SetupType = z.infer<typeof SetupTypeEnum>;

export const TradeCreateSchema = z.object({
  symbol: z.string().min(1).max(20),
  direction: DirectionEnum,
  entryPrice: z.number().positive(),
  exitPrice: z.number().positive().optional(),
  stopPrice: z.number().positive().optional(),
  targetPrice: z.number().positive().optional(),
  quantity: z.number().int().positive().optional(),
  entryDate: z.date().optional(),
  exitDate: z.date().optional(),
  setupType: SetupTypeEnum.optional(),
  tags: z.array(z.string()).optional().default([]),
  notes: z.string().max(1000).optional(),
  screenshotUrl: z.string().url().optional(),
});

export const TradeUpdateSchema = TradeCreateSchema.partial();

export const ParseInputSchema = z.object({
  text: z.string().min(3).max(500),
});

export type TradeCreateInput = z.infer<typeof TradeCreateSchema>;
export type TradeUpdateInput = z.infer<typeof TradeUpdateSchema>;
export type ParseInput = z.infer<typeof ParseInputSchema>;
