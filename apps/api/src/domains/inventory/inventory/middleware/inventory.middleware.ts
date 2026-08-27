import { Request, Response, NextFunction } from 'express';

export const inventoryGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
