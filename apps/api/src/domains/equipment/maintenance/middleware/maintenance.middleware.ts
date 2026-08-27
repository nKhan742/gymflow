import { Request, Response, NextFunction } from 'express';

export const maintenanceGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
