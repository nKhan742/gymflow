import { Request, Response, NextFunction } from 'express';

export const waterIntakeGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
