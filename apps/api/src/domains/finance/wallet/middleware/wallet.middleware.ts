import { Request, Response, NextFunction } from 'express';

export const walletGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
