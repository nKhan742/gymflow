import { Request, Response, NextFunction } from 'express';

export const featureFlagsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
