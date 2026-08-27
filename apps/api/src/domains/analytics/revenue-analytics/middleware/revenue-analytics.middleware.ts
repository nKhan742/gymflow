import { Request, Response, NextFunction } from 'express';

export const revenueAnalyticsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
