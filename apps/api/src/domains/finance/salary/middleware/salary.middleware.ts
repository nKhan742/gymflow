import { Request, Response, NextFunction } from 'express';

export const salaryGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
