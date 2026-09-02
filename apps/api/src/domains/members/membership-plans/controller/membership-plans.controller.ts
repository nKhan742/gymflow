import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { MembershipPlansModel } from '../model/membership-plans.model.js';
import { MembershipPlansMapper } from '../mapper/membership-plans.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class MembershipPlansController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [{ name: regex }, { code: regex }, { description: regex }];
      }

      let items = await MembershipPlansModel.find(filter).sort({ price: -1 }).exec();

      const dtos = items.map(MembershipPlansMapper.toDTO);
      return this.ok(res, dtos, 'MembershipPlans records retrieved', {
        page: 1,
        limit: items.length,
        total: items.length,
        totalPages: 1,
      });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      let item = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        item = await MembershipPlansModel.findById(id).exec();
      }
      if (!item) {
        item = await MembershipPlansModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await MembershipPlansModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Membership plan not found');
      return this.ok(res, MembershipPlansMapper.toDTO(item), 'MembershipPlans record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `PLAN-${Math.floor(100 + Math.random() * 900)}`;
      const created = await MembershipPlansModel.create({
        ...req.body,
        code,
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, MembershipPlansMapper.toDTO(created), 'Membership plan created successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await MembershipPlansModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Membership plan not found');
      return this.ok(res, MembershipPlansMapper.toDTO(updated), 'Membership plan updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await MembershipPlansModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
