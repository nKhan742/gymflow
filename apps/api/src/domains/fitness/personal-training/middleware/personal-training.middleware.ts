import { Request, Response, NextFunction } from 'express';

export const personalTrainingGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
