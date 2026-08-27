import { z } from 'zod';

export const createProductsSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  category: z.enum(['SUPPLEMENTS', 'BEVERAGES', 'APPAREL', 'ACCESSORIES', 'SNACKS', 'PASSES']).optional(),
  price: z.union([z.number(), z.string()]).optional(),
  costPrice: z.union([z.number(), z.string()]).optional(),
  stockQuantity: z.union([z.number(), z.string()]).optional(),
  lowStockThreshold: z.union([z.number(), z.string()]).optional(),
  supplier: z.string().optional(),
  unit: z.string().optional(),
  icon: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateProductsSchema = createProductsSchema.partial();
