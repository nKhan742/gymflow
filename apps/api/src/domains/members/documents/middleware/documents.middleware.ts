import { Request, Response, NextFunction } from 'express';

export const documentsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
