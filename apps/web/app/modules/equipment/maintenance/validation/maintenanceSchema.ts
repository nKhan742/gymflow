import { z } from 'zod';

export const maintenanceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;
