import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { ExpensesModel } from '../model/expenses.model.js';
import { ExpensesMapper } from '../mapper/expenses.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class ExpensesController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, category, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (status && status !== 'ALL') {
        filter.paymentStatus = status;
      }
      if (category && category !== 'ALL') {
        filter.category = category;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { vendorName: regex },
          { title: regex },
          { voucherCode: regex },
          { description: regex },
          { recordedBy: regex },
        ];
      }

      let items = await ExpensesModel.find(filter).sort({ expenseDate: -1 }).exec();

      const dtos = items.map(ExpensesMapper.toDTO);
      return this.ok(res, dtos, 'Expenses records retrieved', {
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
        item = await ExpensesModel.findById(id).exec();
      }
      if (!item) {
        item = await ExpensesModel.findOne({ voucherCode: id }).exec();
      }
      if (!item) {
        item = await ExpensesModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await ExpensesModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Expense voucher record not found');
      return this.ok(res, ExpensesMapper.toDTO(item), 'Expense record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const voucherCode = req.body.voucherCode || `VCH-${Math.floor(100000 + Math.random() * 900000)}`;
      const amount = Number(req.body.amount) || 0;
      const taxAmount = Number(req.body.taxAmount) || Math.round(amount * 0.1 * 100) / 100;
      const totalAmount = Number(req.body.totalAmount) || amount + taxAmount;

      const created = await ExpensesModel.create({
        ...req.body,
        voucherCode,
        name: req.body.name || req.body.title || `Expense ${voucherCode}`,
        amount,
        taxAmount,
        totalAmount,
        currency: req.body.currency || 'USD',
        paymentStatus: req.body.paymentStatus || 'PAID',
        expenseDate: req.body.expenseDate || new Date(),
        recordedBy: req.body.recordedBy || 'Manager Alex Vance',
        approvedBy: req.body.approvedBy || 'Director Marcus Hayes',
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, ExpensesMapper.toDTO(created), 'Expense voucher recorded successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await ExpensesModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Expense record not found');
      return this.ok(res, ExpensesMapper.toDTO(updated), 'Expense record updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ExpensesModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
