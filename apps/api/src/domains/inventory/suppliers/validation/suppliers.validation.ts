import { z } from 'zod';

export const createSuppliersSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  supplierCode: z.string().optional(),
  companyName: z.string().optional(),
  contactPerson: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  categoriesSupplied: z.string().optional(),
  paymentTerms: z.enum(['NET_30', 'NET_15', 'NET_60', 'PREPAID', 'COD']).optional(),
  rating: z.union([z.number(), z.string()]).optional(),
  totalOrdersPlaced: z.union([z.number(), z.string()]).optional(),
  totalSpend: z.union([z.number(), z.string()]).optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateSuppliersSchema = createSuppliersSchema.partial();
