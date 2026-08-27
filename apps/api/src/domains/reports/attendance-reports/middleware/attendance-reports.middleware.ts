import { Request, Response, NextFunction } from 'express';

export const attendanceReportsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
