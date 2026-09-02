import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { ProductsModel } from '../model/products.model.js';
import { ProductsMapper } from '../mapper/products.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class ProductsController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, status, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (category && category !== 'ALL') {
        filter.category = category;
      }
      if (status && status !== 'ALL') {
        filter.status = status;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { name: regex },
          { sku: regex },
          { barcode: regex },
          { description: regex },
          { supplier: regex },
        ];
      }

      let items = await ProductsModel.find(filter).sort({ stockQuantity: -1 }).exec();

      const dtos = items.map(ProductsMapper.toDTO);
      return this.ok(res, dtos, 'Products retrieved successfully', {
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
        item = await ProductsModel.findById(id).exec();
      }
      if (!item) {
        item = await ProductsModel.findOne({ sku: id }).exec();
      }
      if (!item) {
        item = await ProductsModel.findOne({ barcode: id }).exec();
      }
      if (!item) {
        item = await ProductsModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await ProductsModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Product SKU not found');
      return this.ok(res, ProductsMapper.toDTO(item), 'Product retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `PRD-${Math.floor(100 + Math.random() * 900)}`;
      const sku = (req.body.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`).toUpperCase();

      const created = await ProductsModel.create({
        ...req.body,
        code,
        sku,
        name: req.body.name || 'New Retail Product',
        price: Number(req.body.price) || 0,
        costPrice: Number(req.body.costPrice) || 0,
        stockQuantity: Number(req.body.stockQuantity) || 0,
        lowStockThreshold: Number(req.body.lowStockThreshold) || 10,
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, ProductsMapper.toDTO(created), 'Product created successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await ProductsModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Product not found');
      return this.ok(res, ProductsMapper.toDTO(updated), 'Product updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ProductsModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
