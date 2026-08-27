import { z } from 'zod';

export const auditLogsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type AuditLogsFormData = z.infer<typeof auditLogsSchema>;
