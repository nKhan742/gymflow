import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { TransformationModel } from '../model/transformation.model.js';
import { TransformationMapper } from '../mapper/transformation.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class TransformationController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (category && category !== 'ALL') {
        filter.category = category;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { memberName: regex },
          { memberCode: regex },
          { title: regex },
          { coachName: regex },
        ];
      }

      let items = await TransformationModel.find(filter).sort({ isFeatured: -1, createdAt: -1 }).exec();

      const dtos = items.map(TransformationMapper.toDTO);
      return this.ok(res, dtos, 'Transformation records retrieved', {
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
        item = await TransformationModel.findById(id).exec();
      }
      if (!item) {
        item = await TransformationModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await TransformationModel.findOne({ memberCode: id }).exec();
      }
      if (!item) {
        item = await TransformationModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Transformation showcase record not found');
      return this.ok(res, TransformationMapper.toDTO(item), 'Transformation showcase record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `TRF-${Math.floor(1000 + Math.random() * 9000)}`;

      const beforeW = Number(req.body.beforeWeightKg);
      const afterW = Number(req.body.afterWeightKg);
      const weightChangeKg = Number((afterW - beforeW).toFixed(1));

      const beforeBF = Number(req.body.beforeBodyFat || 25);
      const afterBF = Number(req.body.afterBodyFat || 18);
      const bodyFatChange = Number((afterBF - beforeBF).toFixed(1));

      const created = await TransformationModel.create({
        ...req.body,
        code,
        name: req.body.title || `Transformation for ${req.body.memberName || req.body.memberCode}`,
        weightChangeKg,
        bodyFatChange,
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, TransformationMapper.toDTO(created), 'Transformation showcase created successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await TransformationModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Transformation record not found');
      return this.ok(res, TransformationMapper.toDTO(updated), 'Transformation updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await TransformationModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
