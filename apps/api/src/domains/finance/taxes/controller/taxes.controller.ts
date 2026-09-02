import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { TaxesModel } from '../model/taxes.model.js';
import { TaxesMapper } from '../mapper/taxes.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class TaxesController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, type, category, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (status === 'ACTIVE') {
        filter.isActive = true;
      } else if (status === 'INACTIVE') {
        filter.isActive = false;
      }
      if (type && type !== 'ALL') {
        filter.taxType = type;
      }
      if (category && category !== 'ALL') {
        filter.applicableCategory = category;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { taxCode: regex },
          { taxName: regex },
          { description: regex },
          { taxRegistrationNumber: regex },
        ];
      }

      let items = await TaxesModel.find(filter).sort({ taxRate: -1 }).exec();

      const dtos = items.map(TaxesMapper.toDTO);
      return this.ok(res, dtos, 'Taxes records retrieved', {
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
        item = await TaxesModel.findById(id).exec();
      }
      if (!item) {
        item = await TaxesModel.findOne({ taxCode: id.toUpperCase() }).exec();
      }
      if (!item) {
        item = await TaxesModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await TaxesModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Tax rule not found');
      return this.ok(res, TaxesMapper.toDTO(item), 'Tax rule retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `TAX-${Math.floor(100 + Math.random() * 900)}`;
      const taxCode = (req.body.taxCode || `TAX-${Math.floor(10 + Math.random() * 90)}`).toUpperCase();

      if (req.body.isDefault) {
        await TaxesModel.updateMany({ isDefault: true }, { isDefault: false });
      }

      const created = await TaxesModel.create({
        ...req.body,
        code,
        taxCode,
        name: req.body.name || req.body.taxName || `Tax Rate ${taxCode}`,
        taxRate: Number(req.body.taxRate) || 0,
        isDefault: Boolean(req.body.isDefault),
        isActive: req.body.isActive ?? true,
        effectiveFrom: req.body.effectiveFrom || new Date(),
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, TaxesMapper.toDTO(created), 'Tax rule created successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.isDefault) {
        await TaxesModel.updateMany({ isDefault: true }, { isDefault: false });
      }
      const updated = await TaxesModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Tax rule not found');
      return this.ok(res, TaxesMapper.toDTO(updated), 'Tax rule updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await TaxesModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
