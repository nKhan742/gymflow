import { Request, Response, NextFunction } from 'express';

export const membershipPlansGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
