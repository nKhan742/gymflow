import { Request, Response, NextFunction } from 'express';

export const exerciseLibraryGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
