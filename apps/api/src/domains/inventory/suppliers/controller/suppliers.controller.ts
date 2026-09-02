import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { SuppliersModel } from '../model/suppliers.model.js';
import { SuppliersMapper } from '../mapper/suppliers.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class SuppliersController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, terms } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (terms && terms !== 'ALL') {
        filter.paymentTerms = terms;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { companyName: regex },
          { supplierCode: regex },
          { contactPerson: regex },
          { email: regex },
          { categoriesSupplied: regex },
        ];
      }

      let items = await SuppliersModel.find(filter).sort({ totalSpend: -1 }).exec();

      const dtos = items.map(SuppliersMapper.toDTO);
      return this.ok(res, dtos, 'Suppliers retrieved successfully', {
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
        item = await SuppliersModel.findById(id).exec();
      }
      if (!item) {
        item = await SuppliersModel.findOne({ supplierCode: id.toUpperCase() }).exec();
      }
      if (!item) {
        item = await SuppliersModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await SuppliersModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Supplier not found');
      return this.ok(res, SuppliersMapper.toDTO(item), 'Supplier retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `SUP-${Math.floor(100 + Math.random() * 900)}`;
      const supplierCode = (req.body.supplierCode || `SUP-${Math.floor(100 + Math.random() * 900)}`).toUpperCase();

      const created = await SuppliersModel.create({
        ...req.body,
        code,
        supplierCode,
        name: req.body.name || req.body.companyName || 'New Supplier',
        companyName: req.body.companyName || req.body.name || 'New Supplier',
        rating: Number(req.body.rating) || 5.0,
        totalOrdersPlaced: Number(req.body.totalOrdersPlaced) || 0,
        totalSpend: Number(req.body.totalSpend) || 0,
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, SuppliersMapper.toDTO(created), 'Supplier registered successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await SuppliersModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Supplier not found');
      return this.ok(res, SuppliersMapper.toDTO(updated), 'Supplier updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await SuppliersModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
