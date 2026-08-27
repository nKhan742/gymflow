import { Request, Response, NextFunction } from 'express';
import { FacilitiesModel } from '../model/facilities.model.js';
import { BaseResponse } from '../../../../shared/base/BaseResponse.js';

export class FacilitiesController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await FacilitiesModel.find({ isDeleted: false }).exec();
      res.status(200).json(BaseResponse.success({ items, total: items.length }, 'Facilities retrieved.'));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await FacilitiesModel.create({
        ...req.body,
        tenantId: req.body.tenantId || 'tenant_enterprise_01',
        status: 'active',
      });
      res.status(201).json(BaseResponse.success(created, 'Facility zone created.'));
    } catch (error) {
      next(error);
    }
  };
}

