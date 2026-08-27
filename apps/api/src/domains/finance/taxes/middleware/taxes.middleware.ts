import { Request, Response, NextFunction } from 'express';

export const taxesGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
