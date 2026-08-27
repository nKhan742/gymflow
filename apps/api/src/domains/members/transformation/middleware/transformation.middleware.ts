import { Request, Response, NextFunction } from 'express';

export const transformationGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
