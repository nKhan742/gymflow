import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { CategoriesModel } from '../model/categories.model.js';
import { CategoriesMapper } from '../mapper/categories.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class CategoriesController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, posOnly } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (posOnly === 'true') {
        filter.isDisplayedInPOS = true;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { name: regex },
          { categoryCode: regex },
          { slug: regex },
          { description: regex },
        ];
      }

      let items = await CategoriesModel.find(filter).sort({ productCount: -1 }).exec();

      const dtos = items.map(CategoriesMapper.toDTO);
      return this.ok(res, dtos, 'Categories retrieved successfully', {
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
        item = await CategoriesModel.findById(id).exec();
      }
      if (!item) {
        item = await CategoriesModel.findOne({ categoryCode: id.toUpperCase() }).exec();
      }
      if (!item) {
        item = await CategoriesModel.findOne({ slug: id.toLowerCase() }).exec();
      }
      if (!item) {
        item = await CategoriesModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await CategoriesModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Category not found');
      return this.ok(res, CategoriesMapper.toDTO(item), 'Category retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const code = req.body.code || `CAT-${Math.floor(100 + Math.random() * 900)}`;
      const categoryCode = (req.body.categoryCode || `CAT-${Math.floor(10 + Math.random() * 90)}`).toUpperCase();
      const slug = (req.body.slug || req.body.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || `cat-${Date.now()}`);

      const created = await CategoriesModel.create({
        ...req.body,
        code,
        categoryCode,
        slug,
        name: req.body.name || 'New Category',
        taxRate: Number(req.body.taxRate) || 10,
        productCount: Number(req.body.productCount) || 0,
        isDisplayedInPOS: req.body.isDisplayedInPOS ?? true,
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, CategoriesMapper.toDTO(created), 'Category created successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await CategoriesModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Category not found');
      return this.ok(res, CategoriesMapper.toDTO(updated), 'Category updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CategoriesModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
