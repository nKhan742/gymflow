import { Request, Response, NextFunction } from 'express';

export const progressGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
