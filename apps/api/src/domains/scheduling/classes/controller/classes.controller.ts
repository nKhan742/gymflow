import { Request, Response, NextFunction } from 'express';
import { ClassesModel } from '../model/classes.model.js';
import { BaseResponse } from '../../../../shared/base/BaseResponse.js';

export class ClassesController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await ClassesModel.find({ isDeleted: false }).sort({ startTime: 1 }).exec();
      res.status(200).json(BaseResponse.success({ items, total: items.length }, 'Classes schedule retrieved.'));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await ClassesModel.create({
        ...req.body,
        tenantId: req.body.tenantId || 'tenant_enterprise_01',
        status: 'active',
      });
      res.status(201).json(BaseResponse.success(created, 'Class session scheduled.'));
    } catch (error) {
      next(error);
    }
  };
}

