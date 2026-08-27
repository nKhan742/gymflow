import { Request, Response, NextFunction } from 'express';

export const serviceHistoryGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
