import { Request, Response, NextFunction } from 'express';
import { ForbiddenException, UnauthorizedException } from '../exceptions/HttpException.js';

export type PlanTierLevel = 'ESSENTIAL' | 'PROFESSIONAL' | 'ENTERPRISE';

const PLAN_HIERARCHY: Record<PlanTierLevel, number> = {
  ESSENTIAL: 1,
  PROFESSIONAL: 2,
  ENTERPRISE: 3,
};

export const requirePlanTier = (minRequiredTier: PlanTierLevel) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return next(new UnauthorizedException('Authentication required'));
    }

    // Fallback: SUPER_ADMIN gets ENTERPRISE access by default unless specified
    const userTier: PlanTierLevel =
      (user.planTier as PlanTierLevel) || (user.role === 'SUPER_ADMIN' ? 'ENTERPRISE' : 'ESSENTIAL');

    if (PLAN_HIERARCHY[userTier] < PLAN_HIERARCHY[minRequiredTier]) {
      return next(
        new ForbiddenException(
          `This feature requires the ${minRequiredTier} Plan or higher. Please upgrade your subscription in System Configuration.`
        )
      );
    }

    next();
  };
};
