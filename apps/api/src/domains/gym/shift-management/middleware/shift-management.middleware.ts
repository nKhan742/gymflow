import { Request, Response, NextFunction } from 'express';

export const shiftManagementGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
