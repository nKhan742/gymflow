import { Request, Response, NextFunction } from 'express';

export const myProfileGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
