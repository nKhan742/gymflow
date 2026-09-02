import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { FreezeMembershipModel } from '../model/freeze-membership.model.js';
import { FreezeMembershipMapper } from '../mapper/freeze-membership.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class FreezeMembershipController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (status && status !== 'ALL') {
        filter.freezeStatus = status;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { memberName: regex },
          { memberCode: regex },
          { memberEmail: regex },
          { reason: regex },
        ];
      }

      let items = await FreezeMembershipModel.find(filter).sort({ startDate: -1 }).exec();

      const dtos = items.map(FreezeMembershipMapper.toDTO);
      return this.ok(res, dtos, 'FreezeMembership records retrieved', {
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
        item = await FreezeMembershipModel.findById(id).exec();
      }
      if (!item) {
        item = await FreezeMembershipModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await FreezeMembershipModel.findOne({ memberCode: id }).exec();
      }
      if (!item) {
        item = await FreezeMembershipModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Freeze membership record not found');
      return this.ok(res, FreezeMembershipMapper.toDTO(item), 'Freeze membership record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `FRZ-${Math.floor(1000 + Math.random() * 9000)}`;
      const durationDays = req.body.durationDays || 30;
      const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
      const endDate = req.body.endDate
        ? new Date(req.body.endDate)
        : new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

      const created = await FreezeMembershipModel.create({
        ...req.body,
        code,
        name: req.body.name || `Hold for ${req.body.memberName || req.body.memberCode}`,
        startDate,
        endDate,
        durationDays,
        freezeStatus: req.body.freezeStatus || 'ACTIVE_FROZEN',
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, FreezeMembershipMapper.toDTO(created), 'Freeze membership request created successfully');
    } catch (err) {
      next(err);
    }
  };

  unfreeze = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      let item = await FreezeMembershipModel.findById(id).exec();
      if (!item) {
        item = await FreezeMembershipModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await FreezeMembershipModel.findOne({ memberCode: id }).exec();
      }
      if (!item) throw new NotFoundException('Freeze membership record not found');

      item.freezeStatus = 'COMPLETED_UNFROZEN';
      item.endDate = new Date();
      item.notes = `${item.notes || ''} [Early unfreeze processed on ${new Date().toLocaleDateString()}]`;
      await item.save();

      return this.ok(res, FreezeMembershipMapper.toDTO(item), 'Membership unfrozen and resumed successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await FreezeMembershipModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Freeze membership record not found');
      return this.ok(res, FreezeMembershipMapper.toDTO(updated), 'Freeze membership updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await FreezeMembershipModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
