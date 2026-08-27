import { Request, Response, NextFunction } from 'express';

export const trainerScheduleGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
