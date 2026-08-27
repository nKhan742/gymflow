import { z } from 'zod';

export const createCategoriesSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  categoryCode: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  productCount: z.union([z.number(), z.string()]).optional(),
  taxRate: z.union([z.number(), z.string()]).optional(),
  isDisplayedInPOS: z.boolean().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateCategoriesSchema = createCategoriesSchema.partial();
