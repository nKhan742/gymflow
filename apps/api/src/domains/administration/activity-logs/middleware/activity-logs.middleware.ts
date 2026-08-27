import { Request, Response, NextFunction } from 'express';

export const activityLogsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
