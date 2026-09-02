import { z } from 'zod';

export const createStaffSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  code: z.string().optional(),
  name: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(['TRAINER', 'HEAD_COACH', 'NUTRITIONIST', 'RECEPTIONIST', 'MANAGER', 'MAINTENANCE', 'GROUP_INSTRUCTOR']).default('TRAINER'),
  department: z.string().optional().default('FITNESS'),
  specializations: z.array(z.string()).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  shift: z.enum(['MORNING', 'EVENING', 'NIGHT', 'FLEXIBLE']).default('MORNING'),
  hourlyRate: z.number().optional().default(45),
  salary: z.number().optional().default(60000),
  commissionPercentage: z.number().optional().default(20),
  hireDate: z.string().optional(),
  rating: z.number().optional().default(5.0),
  reviewsCount: z.number().optional().default(0),
  activeClientsCount: z.number().optional().default(0),
  workingDays: z.array(z.string()).optional().default(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
  emergencyContact: z.object({
    name: z.string().optional().default(''),
    relationship: z.string().optional().default(''),
    phone: z.string().optional().default(''),
  }).optional(),
  status: z.enum(['active', 'inactive', 'on_leave', 'pending', 'suspended', 'archived']).default('active'),
  description: z.string().optional(),
});

export const updateStaffSchema = createStaffSchema.partial();
