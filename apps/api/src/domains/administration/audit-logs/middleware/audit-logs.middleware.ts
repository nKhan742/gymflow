import { Request, Response, NextFunction } from 'express';

export const auditLogsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
