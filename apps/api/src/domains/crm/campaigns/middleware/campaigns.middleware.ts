import { Request, Response, NextFunction } from 'express';

export const campaignsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
