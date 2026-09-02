import { z } from 'zod';

export const createDepartmentsSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  code: z.string().min(1, 'Department code is required'),
  category: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  headOfDepartment: z.any().optional(),
  headcount: z.number().optional(),
  monthlyBudget: z.number().optional(),
  actualSpend: z.number().optional(),
  revenueGenerating: z.boolean().optional(),
  glCode: z.string().optional(),
  branchId: z.string().optional(),
  branchName: z.string().optional(),
  shifts: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.any().optional(),
}).passthrough();

export const updateDepartmentsSchema = createDepartmentsSchema.partial();
