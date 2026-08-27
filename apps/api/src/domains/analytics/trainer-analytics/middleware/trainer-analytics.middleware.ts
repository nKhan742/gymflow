import { Request, Response, NextFunction } from 'express';

export const trainerAnalyticsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
