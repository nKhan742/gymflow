import { Request, Response, NextFunction } from 'express';

export const discountsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
