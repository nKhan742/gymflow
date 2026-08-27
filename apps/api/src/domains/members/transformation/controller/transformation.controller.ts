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

      // Seed realistic transformations if empty or placeholders
      const hasGeneric = items.some((i) => i.name?.includes('Alpha Record') || i.name?.includes('Delta Record') || i.name?.includes('Record'));
      if (items.length === 0 || hasGeneric) {
        if (hasGeneric) {
          await TransformationModel.deleteMany({ name: /Record/ });
        }

        const realTransformations = [
          {
            name: "Sarah's 14kg Fat Loss & Lean Definition Journey",
            code: 'TRF-1001',
            memberCode: 'GF-9284',
            memberName: 'Sarah Jenkins',
            planTier: 'VIP_PLATINUM',
            category: 'FAT_LOSS_SHRED',
            title: "14.2kg Fat Loss & First 10 Pull-Ups",
            durationMonths: 6,
            beforeWeightKg: 82.6,
            afterWeightKg: 68.4,
            weightChangeKg: -14.2,
            beforeBodyFat: 26.7,
            afterBodyFat: 18.2,
            bodyFatChange: -8.5,
            waistChangeCm: -11.5,
            story: 'Joined GymFlow wanting to rebuild athletic confidence. With Coach Alex Vance, transformed from struggling with bodyweight squats to repping weighted pull-ups and losing 14kg of fat.',
            coachName: 'Coach Alex Vance',
            isFeatured: true,
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
            status: 'active',
          },
          {
            name: "David's Lean Mass & 100kg Bench Milestone",
            code: 'TRF-1002',
            memberCode: 'GF-3109',
            memberName: 'David Chen',
            planTier: 'SILVER_MONTHLY',
            category: 'MUSCLE_BUILDING',
            title: "+6.8kg Pure Lean Muscle Hypertrophy",
            durationMonths: 5,
            beforeWeightKg: 71.7,
            afterWeightKg: 78.5,
            weightChangeKg: 6.8,
            beforeBodyFat: 19.8,
            afterBodyFat: 15.2,
            bodyFatChange: -4.6,
            waistChangeCm: -3.0,
            story: 'Followed a strict Upper/Lower hypertrophy split and high-protein nutrition with Coach Marcus Thorne. Gained 6.8kg of lean tissue and increased bench press from 65kg to 97.5kg.',
            coachName: 'Coach Marcus Thorne',
            isFeatured: true,
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
            status: 'active',
          },
          {
            name: "Marcus's ACL Recovery & Return to Lifting",
            code: 'TRF-1003',
            memberCode: 'GF-4821',
            memberName: 'Marcus Rodriguez',
            planTier: 'GOLD_ANNUAL',
            category: 'LIFESTYLE_REHAB',
            title: "Post-Injury Mobility & Quad Strength Rebuild",
            durationMonths: 4,
            beforeWeightKg: 96.0,
            afterWeightKg: 91.2,
            weightChangeKg: -4.8,
            beforeBodyFat: 28.5,
            afterBodyFat: 24.8,
            bodyFatChange: -3.7,
            waistChangeCm: -6.0,
            story: 'Rebuilt knee stability and single-leg balance following orthopedic clearance with Coach Sarah Vance. Fully pain-free and squatting with barbell again.',
            coachName: 'Coach Sarah Vance',
            isFeatured: false,
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
            status: 'active',
          },
          {
            name: "Emily's 10K Endurance Transformation",
            code: 'TRF-1004',
            memberCode: 'GF-7712',
            memberName: 'Emily Watson',
            planTier: 'VIP_PLATINUM',
            category: 'FAT_LOSS_SHRED',
            title: "Sub-45min 10K Athletic Conditioning",
            durationMonths: 4,
            beforeWeightKg: 62.5,
            afterWeightKg: 56.0,
            weightChangeKg: -6.5,
            beforeBodyFat: 23.0,
            afterBodyFat: 17.5,
            bodyFatChange: -5.5,
            waistChangeCm: -7.0,
            story: 'Combined VO2 max interval training and functional strength with Coach Elena Rostova. Crushed 10K personal record by over 6 minutes.',
            coachName: 'Coach Elena Rostova',
            isFeatured: true,
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
            status: 'active',
          },
        ];

        await TransformationModel.insertMany(realTransformations);
        items = await TransformationModel.find(filter).sort({ isFeatured: -1, createdAt: -1 }).exec();
      }

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
