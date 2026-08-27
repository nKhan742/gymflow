import { Request, Response, NextFunction } from 'express';

export const couponsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
