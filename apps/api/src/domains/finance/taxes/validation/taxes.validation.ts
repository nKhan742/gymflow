import { z } from 'zod';

export const createTaxesSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  taxCode: z.string().optional(),
  taxName: z.string().optional(),
  description: z.string().optional(),
  taxRate: z.union([z.number(), z.string()]).optional(),
  taxType: z.enum(['STANDARD_SALES_TAX', 'FITNESS_SERVICES_TAX', 'POS_RETAIL_NUTRITION_TAX', 'ZERO_RATED_EXEMPT', 'MUNICIPAL_RECREATION_CESS']).optional(),
  calculationMethod: z.enum(['EXCLUSIVE', 'INCLUSIVE']).optional(),
  applicableCategory: z.enum(['ALL_MEMBERSHIPS', 'PERSONAL_TRAINING', 'POS_RETAIL', 'STUDENT_EXEMPT', 'ALL_SERVICES']).optional(),
  taxRegistrationNumber: z.string().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  effectiveFrom: z.union([z.string(), z.date()]).optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updateTaxesSchema = createTaxesSchema.partial();
