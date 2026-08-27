import { Request, Response, NextFunction } from 'express';

export const invoicesGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
