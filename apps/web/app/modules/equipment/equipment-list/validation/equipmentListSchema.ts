import { z } from 'zod';

export const equipmentListSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type EquipmentListFormData = z.infer<typeof equipmentListSchema>;
