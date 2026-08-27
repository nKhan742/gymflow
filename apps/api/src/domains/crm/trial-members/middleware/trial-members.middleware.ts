import { Request, Response, NextFunction } from 'express';

export const trialMembersGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
