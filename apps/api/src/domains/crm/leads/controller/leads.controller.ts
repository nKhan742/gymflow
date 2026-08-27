import { Request, Response, NextFunction } from 'express';
import { LeadsModel } from '../model/leads.model.js';
import { BaseResponse } from '../../../../shared/base/BaseResponse.js';

export class LeadsController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await LeadsModel.find({ isDeleted: false }).sort({ createdAt: -1 }).exec();
      res.status(200).json(BaseResponse.success({ items, total: items.length }, 'CRM leads retrieved.'));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const created = await LeadsModel.create({
        ...req.body,
        tenantId: req.body.tenantId || 'tenant_enterprise_01',
        status: 'active',
      });
      res.status(201).json(BaseResponse.success(created, 'CRM lead registered.'));
    } catch (error) {
      next(error);
    }
  };
}
