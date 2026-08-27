import { Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../exceptions/HttpException.js';

export const tenantMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const tenantIdHeader = req.headers['x-tenant-id'] as string;
  const userTenantId = (req as any).user?.tenantId;
  const tenantId = userTenantId || tenantIdHeader || 'default-tenant';

  if (!tenantId) {
    return next(new BadRequestException('Tenant identification is required'));
  }

  (req as any).tenantId = tenantId;
  next();
};
