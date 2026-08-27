import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { BadRequestException } from '../exceptions/HttpException.js';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors: Record<string, string[]> = {};
        err.errors.forEach((e) => {
          const path = e.path.join('.');
          if (!formattedErrors[path]) formattedErrors[path] = [];
          formattedErrors[path].push(e.message);
        });
        return next(new BadRequestException('Validation failed', formattedErrors));
      }
      next(err);
    }
  };
};
