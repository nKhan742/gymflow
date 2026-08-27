import { Request, Response, NextFunction } from 'express';

export const membershipRenewalsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
