import { Request, Response, NextFunction } from 'express';

export const paymentsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
