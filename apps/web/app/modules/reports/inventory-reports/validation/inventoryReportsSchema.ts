import { z } from 'zod';

export const inventoryReportsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type InventoryReportsFormData = z.infer<typeof inventoryReportsSchema>;
