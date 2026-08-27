import { Request, Response, NextFunction } from 'express';

export const equipmentGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
