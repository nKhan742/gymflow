import { Request, Response, NextFunction } from 'express';

export const smsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
