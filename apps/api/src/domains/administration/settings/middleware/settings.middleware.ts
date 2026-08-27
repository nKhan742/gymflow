import { Request, Response, NextFunction } from 'express';

export const settingsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
