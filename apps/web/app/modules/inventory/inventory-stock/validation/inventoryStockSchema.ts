import { z } from 'zod';

export const inventoryStockSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type InventoryStockFormData = z.infer<typeof inventoryStockSchema>;
