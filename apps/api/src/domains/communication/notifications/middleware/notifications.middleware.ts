import { Request, Response, NextFunction } from 'express';

export const notificationsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
