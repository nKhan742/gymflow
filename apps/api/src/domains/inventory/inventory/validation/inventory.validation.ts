import { z } from 'zod';

export const createInventorySchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  stockCode: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  sku: z.string().optional(),
  category: z.string().optional(),
  quantityOnHand: z.union([z.number(), z.string()]).optional(),
  quantityReserved: z.union([z.number(), z.string()]).optional(),
  quantityAvailable: z.union([z.number(), z.string()]).optional(),
  reorderLevel: z.union([z.number(), z.string()]).optional(),
  reorderQuantity: z.union([z.number(), z.string()]).optional(),
  warehouseLocation: z.string().optional(),
  lastRestockedDate: z.union([z.string(), z.date()]).optional(),
  stockHealth: z.enum(['OPTIMAL', 'LOW_STOCK', 'CRITICAL', 'OUT_OF_STOCK']).optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateInventorySchema = createInventorySchema.partial();
