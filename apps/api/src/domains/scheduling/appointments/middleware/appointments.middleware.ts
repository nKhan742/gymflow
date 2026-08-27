import { Request, Response, NextFunction } from 'express';

export const appointmentsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
