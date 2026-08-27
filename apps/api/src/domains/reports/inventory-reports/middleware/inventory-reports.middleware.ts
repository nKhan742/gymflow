import { Request, Response, NextFunction } from 'express';

export const inventoryReportsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
