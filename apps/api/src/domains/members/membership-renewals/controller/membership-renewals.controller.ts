import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { MembershipRenewalsModel } from '../model/membership-renewals.model.js';
import { MembershipRenewalsMapper } from '../mapper/membership-renewals.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class MembershipRenewalsController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (status && status !== 'ALL') {
        filter.renewalStatus = status;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { memberName: regex },
          { memberCode: regex },
          { memberEmail: regex },
          { currentPlan: regex },
        ];
      }

      let items = await MembershipRenewalsModel.find(filter).sort({ expiryDate: 1 }).exec();

      const dtos = items.map(MembershipRenewalsMapper.toDTO);
      return this.ok(res, dtos, 'MembershipRenewals records retrieved', {
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
        item = await MembershipRenewalsModel.findById(id).exec();
      }
      if (!item) {
        item = await MembershipRenewalsModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await MembershipRenewalsModel.findOne({ memberCode: id }).exec();
      }
      if (!item) {
        item = await MembershipRenewalsModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Membership renewal record not found');
      return this.ok(res, MembershipRenewalsMapper.toDTO(item), 'Membership renewal record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `RNW-${Math.floor(1000 + Math.random() * 9000)}`;
      const created = await MembershipRenewalsModel.create({
        ...req.body,
        code,
        name: req.body.name || `Renewal for ${req.body.memberName || req.body.memberCode}`,
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, MembershipRenewalsMapper.toDTO(created), 'Membership renewal created successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await MembershipRenewalsModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Membership renewal record not found');
      return this.ok(res, MembershipRenewalsMapper.toDTO(updated), 'Membership renewal updated successfully');
    } catch (err) {
      next(err);
    }
  };

  renew = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { durationMonths = 12, planTier, discountPercent = 0 } = req.body;

      let item = await MembershipRenewalsModel.findById(id).exec();
      if (!item) {
        item = await MembershipRenewalsModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await MembershipRenewalsModel.findOne({ memberCode: id }).exec();
      }
      if (!item) throw new NotFoundException('Membership renewal record not found');

      const nextExpiry = new Date();
      nextExpiry.setMonth(nextExpiry.getMonth() + Number(durationMonths));

      item.renewalStatus = 'RENEWED';
      item.daysRemaining = durationMonths * 30;
      item.expiryDate = nextExpiry;
      item.notes = `Renewed on ${new Date().toLocaleDateString()} for ${durationMonths} months. Discount: ${discountPercent}%.`;
      await item.save();

      return this.ok(res, MembershipRenewalsMapper.toDTO(item), 'Membership subscription renewed successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await MembershipRenewalsModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
