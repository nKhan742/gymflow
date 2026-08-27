import { Request, Response, NextFunction } from 'express';

export const leadsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
