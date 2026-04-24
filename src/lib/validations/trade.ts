import { z } from 'zod';
import { DirectionEnum, SetupTypeEnum } from './zodSchemas';

export const EmotionTypeEnum = z.enum([
  'CALM',
  'FOMO',
  'REVENGE',
  'CONFIDENT',
  'UNCERTAIN',
  'BORED'
]);

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
  // New fields for behavioral analytics (Phase 3)
  emotionPre: EmotionTypeEnum.optional(),
  emotionDuring: EmotionTypeEnum.optional(),
  emotionPost: EmotionTypeEnum.optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  fatigueLevel: z.number().min(1).max(10).optional(),
  distractions: z.string().optional(),
});

export const TradeUpdateSchema = TradeCreateSchema.partial();

export type TradeCreateInput = z.infer<typeof TradeCreateSchema>;
export type TradeUpdateInput = z.infer<typeof TradeUpdateSchema>;