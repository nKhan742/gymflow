import { Request, Response, NextFunction } from 'express';

export const trainerCommissionGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
