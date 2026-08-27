import { Request, Response, NextFunction } from 'express';
import { WorkoutPlansModel } from '../model/workout-plans.model.js';
import { BaseResponse } from '../../../../shared/base/BaseResponse.js';

export class WorkoutPlansController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await WorkoutPlansModel.find({ isDeleted: false }).exec();
      res.status(200).json(BaseResponse.success({ items, total: items.length }, 'Workout routines retrieved.'));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await WorkoutPlansModel.create({
        ...req.body,
        tenantId: req.body.tenantId || 'tenant_enterprise_01',
        status: 'active',
      });
      res.status(201).json(BaseResponse.success(created, 'Workout plan created.'));
    } catch (error) {
      next(error);
    }
  };
}
