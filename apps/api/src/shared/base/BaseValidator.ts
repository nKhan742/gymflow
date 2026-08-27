import { z } from 'zod';

export abstract class BaseValidator {
  static objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');
  static pagination = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  });
}
