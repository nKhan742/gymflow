import { z } from 'zod';

export const createUsersSchema = z.object({
  _id: z.string().optional(),
  name: z.string().optional(),
  fullName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  avatar: z.string().optional(),
  role: z.string().optional(),
  roleName: z.string().optional(),
  department: z.string().optional(),
  branchId: z.string().optional(),
  branchName: z.string().optional(),
  mfaEnabled: z.boolean().optional(),
  securityScore: z.number().optional(),
  lastLoginAt: z.string().optional(),
  ipAddress: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived', 'draft']).optional().default('active'),
  password: z.string().optional(),
  passwordHash: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const updateUsersSchema = createUsersSchema.partial();
