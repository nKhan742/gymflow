import { Request, Response, NextFunction } from 'express';

export const trainerReportsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
