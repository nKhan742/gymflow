import { Request, Response, NextFunction } from 'express';

export const growthAnalyticsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
