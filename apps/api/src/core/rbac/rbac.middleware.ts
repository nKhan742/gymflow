import { Request, Response, NextFunction } from 'express';
import { ForbiddenException, UnauthorizedException } from '../exceptions/HttpException.js';

export const requirePermission = (permission: string | string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return next(new UnauthorizedException('Authentication required'));
    }

    if (user.role === 'SUPER_ADMIN' || user.role === 'GYM_OWNER') {
      return next();
    }

    const perms = Array.isArray(permission) ? permission : [permission];
    const userPerms = new Set(user.permissions || []);
    const hasPerm = perms.some((p) => userPerms.has(p));

    if (!hasPerm) {
      return next(new ForbiddenException(`Missing required permission: ${perms.join(', ')}`));
    }

    next();
  };
};

export const requireRole = (role: string | string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return next(new UnauthorizedException('Authentication required'));
    }

    const roles = Array.isArray(role) ? role : [role];
    if (!roles.includes(user.role)) {
      return next(new ForbiddenException(`Access restricted to roles: ${roles.join(', ')}`));
    }

    next();
  };
};
