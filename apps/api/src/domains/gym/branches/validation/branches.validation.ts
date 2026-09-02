import { z } from 'zod';

export const createBranchesSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  code: z.string().min(1, 'Branch code is required'),
  tagline: z.string().optional(),
  image: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  sqFt: z.number().optional(),
  capacity: z.number().optional(),
  currentOccupancy: z.number().optional(),
  memberCount: z.number().optional(),
  staffCount: z.number().optional(),
  turnstileCount: z.number().optional(),
  monthlyRevenue: z.number().optional(),
  address: z.any().optional(),
  manager: z.any().optional(),
  operatingHours: z.any().optional(),
  amenities: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.any().optional(),
}).passthrough();

export const updateBranchesSchema = createBranchesSchema.partial();
