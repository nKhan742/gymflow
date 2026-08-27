import { z } from 'zod';

export const stockAdjustmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type StockAdjustmentFormData = z.infer<typeof stockAdjustmentSchema>;
