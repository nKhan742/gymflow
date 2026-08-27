import { Request, Response, NextFunction } from 'express';

export const followUpsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
