import { Request, Response, NextFunction } from 'express';

export const tasksGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
