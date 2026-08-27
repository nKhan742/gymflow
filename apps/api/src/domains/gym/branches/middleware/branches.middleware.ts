import { Request, Response, NextFunction } from 'express';

export const branchesGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
