import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { BodyMeasurementsModel } from '../model/body-measurements.model.js';
import { BodyMeasurementsMapper } from '../mapper/body-measurements.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class BodyMeasurementsController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { memberName: regex },
          { memberCode: regex },
          { measuredBy: regex },
        ];
      }

      let items = await BodyMeasurementsModel.find(filter).sort({ measurementDate: -1 }).exec();

      const dtos = items.map(BodyMeasurementsMapper.toDTO);
      return this.ok(res, dtos, 'BodyMeasurements records retrieved', {
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
        item = await BodyMeasurementsModel.findById(id).exec();
      }
      if (!item) {
        item = await BodyMeasurementsModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await BodyMeasurementsModel.findOne({ memberCode: id }).exec();
      }
      if (!item) {
        item = await BodyMeasurementsModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Body measurements record not found');
      return this.ok(res, BodyMeasurementsMapper.toDTO(item), 'Body measurements record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `BMS-${Math.floor(1000 + Math.random() * 9000)}`;

      const waist = Number(req.body.waist);
      const hips = Number(req.body.hips);
      const whr = hips > 0 ? Number((waist / hips).toFixed(2)) : 0.78;

      let whrCategory: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' = 'LOW_RISK';
      if (whr > 0.95) whrCategory = 'HIGH_RISK';
      else if (whr > 0.85) whrCategory = 'MODERATE_RISK';

      const created = await BodyMeasurementsModel.create({
        ...req.body,
        code,
        name: req.body.name || `Measurements for ${req.body.memberName || req.body.memberCode}`,
        waistToHipRatio: whr,
        whrCategory,
        measurementDate: req.body.measurementDate || new Date(),
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, BodyMeasurementsMapper.toDTO(created), 'Body measurements logged successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await BodyMeasurementsModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Body measurements record not found');
      return this.ok(res, BodyMeasurementsMapper.toDTO(updated), 'Body measurements updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BodyMeasurementsModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
