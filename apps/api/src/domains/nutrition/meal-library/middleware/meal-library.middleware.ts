import { Request, Response, NextFunction } from 'express';

export const mealLibraryGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
