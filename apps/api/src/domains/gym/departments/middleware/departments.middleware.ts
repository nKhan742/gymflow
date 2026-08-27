import { Request, Response, NextFunction } from 'express';

export const departmentsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
