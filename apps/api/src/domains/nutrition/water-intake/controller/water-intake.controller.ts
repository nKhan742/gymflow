import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { WaterIntakeService } from '../service/water-intake.service.js';

export class WaterIntakeController extends BaseController {
  constructor(private readonly service: WaterIntakeService = new WaterIntakeService()) {
    super();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const { page, limit, sortBy, sortOrder } = req.query as any;
      const data = await this.service.findAll(tenantId, { page: Number(page), limit: Number(limit), sortBy, sortOrder });
      return this.ok(res, data.items, 'WaterIntake records retrieved', {
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const data = await this.service.findById(req.params.id, tenantId);
      return this.ok(res, data, 'WaterIntake record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const userId = this.getUserId(req);
      const data = await this.service.create(tenantId, req.body, userId);
      return this.created(res, data, 'WaterIntake created successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const userId = this.getUserId(req);
      const data = await this.service.update(req.params.id, tenantId, req.body, userId);
      return this.ok(res, data, 'WaterIntake updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const userId = this.getUserId(req);
      await this.service.delete(req.params.id, tenantId, userId);
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
