import { Request, Response, NextFunction } from 'express';

export const memberAnalyticsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
