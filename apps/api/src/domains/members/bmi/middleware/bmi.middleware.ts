import { Request, Response, NextFunction } from 'express';

export const bmiGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
