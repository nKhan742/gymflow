import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { BmiModel } from '../model/bmi.model.js';
import { BmiMapper } from '../mapper/bmi.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class BmiController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (category && category !== 'ALL') {
        filter.bmiCategory = category;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { memberName: regex },
          { memberCode: regex },
          { assessedBy: regex },
        ];
      }

      let items = await BmiModel.find(filter).sort({ assessmentDate: -1 }).exec();

      const dtos = items.map(BmiMapper.toDTO);
      return this.ok(res, dtos, 'Bmi records retrieved', {
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
        item = await BmiModel.findById(id).exec();
      }
      if (!item) {
        item = await BmiModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await BmiModel.findOne({ memberCode: id }).exec();
      }
      if (!item) {
        item = await BmiModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('BMI assessment record not found');
      return this.ok(res, BmiMapper.toDTO(item), 'BMI assessment record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `BMI-${Math.floor(1000 + Math.random() * 9000)}`;

      const heightM = Number(req.body.heightCm) / 100;
      const weightKg = Number(req.body.weightKg);
      const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

      let bmiCategory: 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE' = 'NORMAL';
      if (bmi < 18.5) bmiCategory = 'UNDERWEIGHT';
      else if (bmi < 25) bmiCategory = 'NORMAL';
      else if (bmi < 30) bmiCategory = 'OVERWEIGHT';
      else bmiCategory = 'OBESE';

      const bmrKcal = req.body.gender === 'MALE'
        ? Math.round(10 * weightKg + 6.25 * Number(req.body.heightCm) - 5 * (req.body.age || 28) + 5)
        : Math.round(10 * weightKg + 6.25 * Number(req.body.heightCm) - 5 * (req.body.age || 28) - 161);

      const created = await BmiModel.create({
        ...req.body,
        code,
        name: req.body.name || `Assessment for ${req.body.memberName || req.body.memberCode}`,
        bmi,
        bmiCategory,
        bmrKcal: req.body.bmrKcal || bmrKcal,
        assessmentDate: req.body.assessmentDate || new Date(),
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, BmiMapper.toDTO(created), 'BMI assessment recorded successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await BmiModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('BMI assessment record not found');
      return this.ok(res, BmiMapper.toDTO(updated), 'BMI assessment updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BmiModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
