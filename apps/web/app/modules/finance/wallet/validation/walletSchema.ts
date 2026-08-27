import { z } from 'zod';

export const walletSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type WalletFormData = z.infer<typeof walletSchema>;
