import { Request, Response, NextFunction } from 'express';

export const dietPlansGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
