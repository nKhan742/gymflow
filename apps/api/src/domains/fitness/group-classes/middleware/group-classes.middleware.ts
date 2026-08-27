import { Request, Response, NextFunction } from 'express';

export const groupClassesGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
