import { Request, Response, NextFunction } from 'express';

export const referralsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
