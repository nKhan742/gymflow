import { Request, Response, NextFunction } from 'express';

export const medicalHistoryGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
