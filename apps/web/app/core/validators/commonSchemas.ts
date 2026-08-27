import { z } from 'zod';

export const emailSchema = z.string().email('Please enter a valid email address');
export const phoneSchema = z.string().min(8, 'Phone number must be at least 8 characters');
export const requiredString = (fieldName: string) =>
  z.string().min(1, fieldName + ' is required');
