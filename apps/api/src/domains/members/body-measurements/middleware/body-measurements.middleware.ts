import { Request, Response, NextFunction } from 'express';

export const bodyMeasurementsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
