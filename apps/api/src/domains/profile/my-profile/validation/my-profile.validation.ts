import { z } from 'zod';

export const createMyProfileSchema = z.object({
  name: z.string().optional(),
  fullName: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional().default('active'),
}).passthrough();

export const updateMyProfileSchema = z.object({
  fullName: z.string().optional(),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  avatar: z.string().optional(),
  coverBannerUrl: z.string().optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  branchId: z.string().optional(),
  shiftSchedule: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  bio: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  status: z.string().optional(),
}).passthrough();
