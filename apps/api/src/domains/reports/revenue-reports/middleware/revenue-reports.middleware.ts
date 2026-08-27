import { Request, Response, NextFunction } from 'express';

export const revenueReportsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
