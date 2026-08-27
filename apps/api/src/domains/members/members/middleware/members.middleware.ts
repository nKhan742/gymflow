import { Request, Response, NextFunction } from 'express';

export const membersGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
