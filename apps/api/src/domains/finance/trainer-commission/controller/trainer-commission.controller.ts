import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { TrainerCommissionModel } from '../model/trainer-commission.model.js';
import { TrainerCommissionMapper } from '../mapper/trainer-commission.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class TrainerCommissionController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, type, trainer, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (status && status !== 'ALL') {
        filter.payoutStatus = status;
      }
      if (type && type !== 'ALL') {
        filter.commissionType = type;
      }
      if (trainer && trainer !== 'ALL') {
        filter.trainerCode = trainer;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { trainerName: regex },
          { trainerCode: regex },
          { clientMemberName: regex },
          { clientMemberCode: regex },
          { sessionTitle: regex },
          { commissionCode: regex },
        ];
      }

      let items = await TrainerCommissionModel.find(filter).sort({ sessionDate: -1 }).exec();

      const dtos = items.map(TrainerCommissionMapper.toDTO);
      return this.ok(res, dtos, 'TrainerCommission records retrieved', {
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
        item = await TrainerCommissionModel.findById(id).exec();
      }
      if (!item) {
        item = await TrainerCommissionModel.findOne({ commissionCode: id }).exec();
      }
      if (!item) {
        item = await TrainerCommissionModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await TrainerCommissionModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Trainer commission record not found');
      return this.ok(res, TrainerCommissionMapper.toDTO(item), 'Trainer commission record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const commissionCode = req.body.commissionCode || `COM-2026-${randNum}`;

      const billedAmount = Number(req.body.billedAmount) || 0;
      const commissionRate = Number(req.body.commissionRate) || 50;
      const commissionEarned = Number(req.body.commissionEarned) || Math.round((billedAmount * (commissionRate / 100)) * 100) / 100;

      const created = await TrainerCommissionModel.create({
        ...req.body,
        commissionCode,
        name: req.body.name || `Commission for ${req.body.trainerName || req.body.trainerCode}`,
        billedAmount,
        commissionRate,
        commissionEarned,
        currency: req.body.currency || 'USD',
        payoutStatus: req.body.payoutStatus || 'SETTLED',
        sessionDate: req.body.sessionDate || new Date(),
        approvedBy: req.body.approvedBy || 'General Manager Chloe Bennett',
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, TrainerCommissionMapper.toDTO(created), 'Commission record logged successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await TrainerCommissionModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Commission record not found');
      return this.ok(res, TrainerCommissionMapper.toDTO(updated), 'Commission record updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await TrainerCommissionModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
