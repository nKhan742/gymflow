import { z } from 'zod';

export const createRolesSchema = z.object({
  name: z.string().optional(),
  roleName: z.string().optional(),
  code: z.string().optional(),
  roleKey: z.string().optional(),
  description: z.string().optional(),
  hierarchyTier: z.number().optional(),
  isSystemRole: z.boolean().optional(),
  assignedUsersCount: z.number().optional(),
  permissionModulesCount: z.number().optional(),
  permissionsList: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
  status: z.string().optional(),
  metadata: z.record(z.any()).optional(),
}).passthrough();

export const updateRolesSchema = createRolesSchema.partial().passthrough();

