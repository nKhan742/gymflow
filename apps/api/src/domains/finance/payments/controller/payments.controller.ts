import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { PaymentsModel } from '../model/payments.model.js';
import { PaymentsMapper } from '../mapper/payments.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class PaymentsController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, category, method, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (status && status !== 'ALL') {
        filter.paymentStatus = status;
      }
      if (category && category !== 'ALL') {
        filter.category = category;
      }
      if (method && method !== 'ALL') {
        filter.paymentMethod = method;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { memberName: regex },
          { memberCode: regex },
          { transactionCode: regex },
          { invoiceNumber: regex },
          { description: regex },
        ];
      }

      let items = await PaymentsModel.find(filter).sort({ paymentDate: -1 }).exec();

      const dtos = items.map(PaymentsMapper.toDTO);
      return this.ok(res, dtos, 'Payments records retrieved', {
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
        item = await PaymentsModel.findById(id).exec();
      }
      if (!item) {
        item = await PaymentsModel.findOne({ transactionCode: id }).exec();
      }
      if (!item) {
        item = await PaymentsModel.findOne({ invoiceNumber: id }).exec();
      }
      if (!item) {
        item = await PaymentsModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Payment transaction record not found');
      return this.ok(res, PaymentsMapper.toDTO(item), 'Payment transaction retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const randNum = Math.floor(100000 + Math.random() * 900000);
      const transactionCode = req.body.transactionCode || `TXN-${randNum}`;
      const invoiceNumber = req.body.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const amount = Number(req.body.amount) || 0;
      const taxAmount = Number(req.body.taxAmount) || Math.round(amount * 0.1 * 100) / 100;
      const discountAmount = Number(req.body.discountAmount) || 0;
      const totalAmount = Number(req.body.totalAmount) || Math.max(0, amount + taxAmount - discountAmount);

      const created = await PaymentsModel.create({
        ...req.body,
        transactionCode,
        invoiceNumber,
        name: req.body.name || `${req.body.category || 'Payment'} - ${req.body.memberName || req.body.memberCode}`,
        amount,
        taxAmount,
        discountAmount,
        totalAmount,
        currency: req.body.currency || 'USD',
        paymentStatus: req.body.paymentStatus || 'COMPLETED',
        paymentDate: req.body.paymentDate || new Date(),
        collectedBy: req.body.collectedBy || 'Desk Cashier Alex Vance',
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, PaymentsMapper.toDTO(created), 'Payment collected successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await PaymentsModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Payment record not found');
      return this.ok(res, PaymentsMapper.toDTO(updated), 'Payment record updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await PaymentsModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
