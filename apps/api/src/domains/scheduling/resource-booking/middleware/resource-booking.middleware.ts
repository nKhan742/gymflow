import { Request, Response, NextFunction } from 'express';

export const resourceBookingGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
