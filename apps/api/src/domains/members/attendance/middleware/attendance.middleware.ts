import { Request, Response, NextFunction } from 'express';

export const attendanceGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
