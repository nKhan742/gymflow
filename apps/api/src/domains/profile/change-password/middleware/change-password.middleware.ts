import { Request, Response, NextFunction } from 'express';

export const changePasswordGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
