import { Request, Response, NextFunction } from 'express';

export const expensesGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
