import { Request, Response, NextFunction } from 'express';

export const categoriesGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
