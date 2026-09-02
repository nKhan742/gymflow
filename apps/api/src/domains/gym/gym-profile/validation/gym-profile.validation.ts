import { z } from 'zod';

export const createGymProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  taxId: z.string().optional(),
  businessLicense: z.string().optional(),
  foundedYear: z.number().optional(),
  currency: z.string().optional(),
  defaultTaxRate: z.number().optional(),
  invoiceHeader: z.string().optional(),
  invoiceFooter: z.string().optional(),
  is24x7: z.boolean().optional(),
  maxCapacity: z.number().optional(),
  currentOccupancy: z.number().optional(),
  address: z.any().optional(),
  contacts: z.any().optional(),
  operatingHours: z.any().optional(),
  amenities: z.array(z.string()).optional(),
  zones: z.array(z.any()).optional(),
  accessControl: z.any().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.any().optional(),
}).passthrough();

export const updateGymProfileSchema = createGymProfileSchema.partial();
