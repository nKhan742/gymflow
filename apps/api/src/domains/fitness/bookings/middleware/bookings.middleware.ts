import { Request, Response, NextFunction } from 'express';

export const bookingsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
