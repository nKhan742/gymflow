import { Request, Response, NextFunction } from 'express';

export const whatsappGuard = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};
