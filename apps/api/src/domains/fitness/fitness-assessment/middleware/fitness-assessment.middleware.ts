import { Request, Response, NextFunction } from 'express';

export const fitnessAssessmentGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
