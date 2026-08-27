import { Request, Response, NextFunction } from 'express';

export const attendanceAnalyticsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
