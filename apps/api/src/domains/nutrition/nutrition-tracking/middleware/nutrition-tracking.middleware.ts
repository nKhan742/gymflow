import { Request, Response, NextFunction } from 'express';

export const nutritionTrackingGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
