import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { InventoryModel } from '../model/inventory.model.js';
import { InventoryMapper } from '../mapper/inventory.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class InventoryController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { health, category, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (health && health !== 'ALL') {
        filter.stockHealth = health;
      }
      if (category && category !== 'ALL') {
        filter.category = category;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { productName: regex },
          { sku: regex },
          { stockCode: regex },
          { warehouseLocation: regex },
        ];
      }

      let items = await InventoryModel.find(filter).sort({ quantityOnHand: -1 }).exec();

      const dtos = items.map(InventoryMapper.toDTO);
      return this.ok(res, dtos, 'Inventory stock retrieved successfully', {
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
        item = await InventoryModel.findById(id).exec();
      }
      if (!item) {
        item = await InventoryModel.findOne({ stockCode: id.toUpperCase() }).exec();
      }
      if (!item) {
        item = await InventoryModel.findOne({ sku: id }).exec();
      }
      if (!item) {
        item = await InventoryModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await InventoryModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Inventory stock record not found');
      return this.ok(res, InventoryMapper.toDTO(item), 'Inventory stock record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const randNum = Math.floor(100 + Math.random() * 900);
      const stockCode = req.body.stockCode || `STK-${randNum}`;

      const onHand = Number(req.body.quantityOnHand) || 0;
      const reserved = Number(req.body.quantityReserved) || 0;
      const available = Math.max(0, onHand - reserved);
      const reorderLevel = Number(req.body.reorderLevel) || 10;

      let stockHealth: 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL' | 'OUT_OF_STOCK' = 'OPTIMAL';
      if (onHand === 0) stockHealth = 'OUT_OF_STOCK';
      else if (onHand <= Math.floor(reorderLevel / 2)) stockHealth = 'CRITICAL';
      else if (onHand <= reorderLevel) stockHealth = 'LOW_STOCK';

      const created = await InventoryModel.create({
        ...req.body,
        stockCode,
        name: req.body.name || `Stock for ${req.body.productName || req.body.sku}`,
        quantityOnHand: onHand,
        quantityReserved: reserved,
        quantityAvailable: available,
        reorderLevel,
        stockHealth,
        lastRestockedDate: new Date(),
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, InventoryMapper.toDTO(created), 'Inventory stock record created successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const onHand = req.body.quantityOnHand !== undefined ? Number(req.body.quantityOnHand) : undefined;
      const reserved = req.body.quantityReserved !== undefined ? Number(req.body.quantityReserved) : undefined;

      const current = await InventoryModel.findById(req.params.id);
      if (!current) throw new NotFoundException('Inventory stock record not found');

      const finalOnHand = onHand !== undefined ? onHand : current.quantityOnHand;
      const finalReserved = reserved !== undefined ? reserved : current.quantityReserved;
      const finalAvailable = Math.max(0, finalOnHand - finalReserved);
      const finalReorder = req.body.reorderLevel !== undefined ? Number(req.body.reorderLevel) : current.reorderLevel;

      let stockHealth: 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL' | 'OUT_OF_STOCK' = 'OPTIMAL';
      if (finalOnHand === 0) stockHealth = 'OUT_OF_STOCK';
      else if (finalOnHand <= Math.floor(finalReorder / 2)) stockHealth = 'CRITICAL';
      else if (finalOnHand <= finalReorder) stockHealth = 'LOW_STOCK';

      const updated = await InventoryModel.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          quantityOnHand: finalOnHand,
          quantityReserved: finalReserved,
          quantityAvailable: finalAvailable,
          stockHealth,
        },
        { new: true }
      ).exec();

      return this.ok(res, InventoryMapper.toDTO(updated!), 'Inventory stock updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await InventoryModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
