import { Request, Response, NextFunction } from 'express';

export const memberReportsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
