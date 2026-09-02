import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { PurchasesModel } from '../model/purchases.model.js';
import { PurchasesMapper } from '../mapper/purchases.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class PurchasesController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, payment, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (status && status !== 'ALL') {
        filter.orderStatus = status;
      }
      if (payment && payment !== 'ALL') {
        filter.paymentStatus = payment;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { purchaseOrderNumber: regex },
          { supplierName: regex },
          { supplierCode: regex },
          { notes: regex },
        ];
      }

      let items = await PurchasesModel.find(filter).sort({ orderDate: -1 }).exec();

      const dtos = items.map(PurchasesMapper.toDTO);
      return this.ok(res, dtos, 'Purchases retrieved successfully', {
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
        item = await PurchasesModel.findById(id).exec();
      }
      if (!item) {
        item = await PurchasesModel.findOne({ purchaseOrderNumber: id.toUpperCase() }).exec();
      }
      if (!item) {
        item = await PurchasesModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await PurchasesModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Purchase order not found');
      return this.ok(res, PurchasesMapper.toDTO(item), 'Purchase order retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const purchaseOrderNumber = req.body.purchaseOrderNumber || `PO-2026-${randNum}`;

      const subtotal = Number(req.body.subtotal) || 0;
      const tax = Number(req.body.tax) || 0;
      const shippingCost = Number(req.body.shippingCost) || 0;
      const totalAmount = Number(req.body.totalAmount) || (subtotal + tax + shippingCost);

      const created = await PurchasesModel.create({
        ...req.body,
        purchaseOrderNumber,
        name: req.body.name || `PO #${purchaseOrderNumber} - ${req.body.supplierName || 'Supplier'}`,
        subtotal,
        tax,
        shippingCost,
        totalAmount,
        currency: req.body.currency || 'USD',
        orderStatus: req.body.orderStatus || 'ORDERED',
        paymentStatus: req.body.paymentStatus || 'PENDING',
        orderDate: req.body.orderDate || new Date(),
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, PurchasesMapper.toDTO(created), 'Purchase order generated successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await PurchasesModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Purchase order not found');
      return this.ok(res, PurchasesMapper.toDTO(updated), 'Purchase order updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await PurchasesModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
