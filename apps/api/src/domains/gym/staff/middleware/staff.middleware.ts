import { Request, Response, NextFunction } from 'express';

export const staffGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
