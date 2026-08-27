import { z } from 'zod';

export const createStockAdjustmentSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  adjustmentCode: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  sku: z.string().optional(),
  adjustmentType: z.enum(['INCREASE', 'DECREASE', 'DAMAGE_WRITE_OFF', 'EXPIRED_BATCH', 'THEFT_LOSS', 'CYCLE_COUNT_CORRECTION']).optional(),
  previousQuantity: z.union([z.number(), z.string()]).optional(),
  adjustedQuantity: z.union([z.number(), z.string()]).optional(),
  finalQuantity: z.union([z.number(), z.string()]).optional(),
  reason: z.string().optional(),
  adjustedDate: z.union([z.string(), z.date()]).optional(),
  adjustedBy: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateStockAdjustmentSchema = createStockAdjustmentSchema.partial();
