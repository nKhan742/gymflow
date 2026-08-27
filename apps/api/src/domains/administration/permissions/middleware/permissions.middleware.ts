import { Request, Response, NextFunction } from 'express';

export const permissionsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
