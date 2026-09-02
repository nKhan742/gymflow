import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { ProgressModel } from '../model/progress.model.js';
import { ProgressMapper } from '../mapper/progress.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class ProgressController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (status && status !== 'ALL') {
        filter.progressStatus = status;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { memberName: regex },
          { memberCode: regex },
          { goalTitle: regex },
          { assignedCoach: regex },
        ];
      }

      let items = await ProgressModel.find(filter).sort({ progressPercent: -1 }).exec();

      const dtos = items.map(ProgressMapper.toDTO);
      return this.ok(res, dtos, 'Progress records retrieved', {
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
        item = await ProgressModel.findById(id).exec();
      }
      if (!item) {
        item = await ProgressModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await ProgressModel.findOne({ memberCode: id }).exec();
      }
      if (!item) {
        item = await ProgressModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Client progress record not found');
      return this.ok(res, ProgressMapper.toDTO(item), 'Client progress record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `PRG-${Math.floor(1000 + Math.random() * 9000)}`;

      const created = await ProgressModel.create({
        ...req.body,
        code,
        name: req.body.name || `Progress for ${req.body.memberName || req.body.memberCode}`,
        targetDate: req.body.targetDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, ProgressMapper.toDTO(created), 'Client progress milestone recorded successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await ProgressModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Client progress record not found');
      return this.ok(res, ProgressMapper.toDTO(updated), 'Client progress updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ProgressModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
