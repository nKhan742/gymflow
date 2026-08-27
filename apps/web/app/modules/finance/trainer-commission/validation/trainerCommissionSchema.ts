import { z } from 'zod';

export const trainerCommissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type TrainerCommissionFormData = z.infer<typeof trainerCommissionSchema>;
