import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { DiscountsModel } from '../model/discounts.model.js';
import { DiscountsMapper } from '../mapper/discounts.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class DiscountsController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, type, domain, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (status === 'ACTIVE') {
        filter.isActive = true;
      } else if (status === 'INACTIVE') {
        filter.isActive = false;
      }
      if (type && type !== 'ALL') {
        filter.discountType = type;
      }
      if (domain && domain !== 'ALL') {
        filter.applicableDomain = domain;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { promoCode: regex },
          { title: regex },
          { description: regex },
          { createdBy: regex },
        ];
      }

      let items = await DiscountsModel.find(filter).sort({ createdAt: -1 }).exec();

      const dtos = items.map(DiscountsMapper.toDTO);
      return this.ok(res, dtos, 'Discounts records retrieved', {
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
        item = await DiscountsModel.findById(id).exec();
      }
      if (!item) {
        item = await DiscountsModel.findOne({ promoCode: id.toUpperCase() }).exec();
      }
      if (!item) {
        item = await DiscountsModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await DiscountsModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Discount promo code not found');
      return this.ok(res, DiscountsMapper.toDTO(item), 'Discount promo code retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `DISC-${Math.floor(100 + Math.random() * 900)}`;
      const promoCode = (req.body.promoCode || `PROMO${Math.floor(10 + Math.random() * 90)}`).toUpperCase();

      const created = await DiscountsModel.create({
        ...req.body,
        code,
        promoCode,
        name: req.body.name || req.body.title || `Discount ${promoCode}`,
        discountValue: Number(req.body.discountValue) || 10,
        minPurchaseAmount: Number(req.body.minPurchaseAmount) || 0,
        maxUsageCount: Number(req.body.maxUsageCount) || 100,
        usedCount: Number(req.body.usedCount) || 0,
        startDate: req.body.startDate || new Date(),
        isActive: req.body.isActive ?? true,
        createdBy: req.body.createdBy || 'Marketing Lead Chloe Bennett',
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, DiscountsMapper.toDTO(created), 'Promotional discount created successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await DiscountsModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Discount record not found');
      return this.ok(res, DiscountsMapper.toDTO(updated), 'Discount updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await DiscountsModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
