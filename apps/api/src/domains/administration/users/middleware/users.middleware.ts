import { Request, Response, NextFunction } from 'express';

export const usersGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
