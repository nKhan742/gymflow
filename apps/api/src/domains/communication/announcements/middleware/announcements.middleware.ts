import { Request, Response, NextFunction } from 'express';

export const announcementsGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
