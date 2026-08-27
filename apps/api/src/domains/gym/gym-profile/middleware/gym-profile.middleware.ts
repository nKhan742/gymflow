import { Request, Response, NextFunction } from 'express';

export const gymProfileGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
