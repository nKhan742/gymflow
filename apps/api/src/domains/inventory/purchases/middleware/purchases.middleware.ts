import { Request, Response, NextFunction } from 'express';

export const purchasesGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
