import { Request, Response, NextFunction } from 'express';
import { InvoicesModel } from '../model/invoices.model.js';
import { BaseResponse } from '../../../../shared/base/BaseResponse.js';

export class InvoicesController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, search } = req.query;
      const filter: Record<string, any> = { isDeleted: false };
      if (status && status !== 'ALL') {
        filter.paymentStatus = new RegExp(`^${status}$`, 'i');
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [{ invoiceNumber: regex }, { memberName: regex }, { memberEmail: regex }];
      }

      let items = await InvoicesModel.find(filter).sort({ createdAt: -1 }).exec();

      // Auto-provision initial data if empty
      if (items.length === 0 && !search && (!status || status === 'ALL')) {
        const initialInvoices = [
          {
            invoiceNumber: 'INV-2026-8801',
            memberId: 'GF-9284',
            memberName: 'Sarah Jenkins',
            memberEmail: 'sarah.jenkins@example.com',
            items: [
              { description: 'VIP Platinum All-Access Annual Pass', quantity: 1, unitPrice: 1499, total: 1499 },
              { description: 'Locker Rental (Annual)', quantity: 1, unitPrice: 120, total: 120 },
            ],
            subtotal: 1619,
            tax: 129,
            discount: 100,
            totalAmount: 1648,
            currency: 'USD',
            paymentMethod: 'CREDIT_CARD',
            paymentStatus: 'PAID',
            dueDate: new Date().toISOString(),
            paidAt: new Date().toISOString(),
            status: 'active',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
          },
          {
            invoiceNumber: 'INV-2026-8802',
            memberId: 'GF-9285',
            memberName: 'Marcus Brody',
            memberEmail: 'marcus.brody@example.com',
            items: [
              { description: 'Gold Annual Pass', quantity: 1, unitPrice: 899, total: 899 },
            ],
            subtotal: 899,
            tax: 71,
            discount: 0,
            totalAmount: 970,
            currency: 'USD',
            paymentMethod: 'STRIPE',
            paymentStatus: 'PAID',
            dueDate: new Date().toISOString(),
            paidAt: new Date().toISOString(),
            status: 'active',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
          },
          {
            invoiceNumber: 'INV-2026-8803',
            memberId: 'GF-9286',
            memberName: 'Elena Rostova',
            memberEmail: 'elena.rostova@example.com',
            items: [
              { description: 'Personal Training 10-Pack (Coach Alex)', quantity: 1, unitPrice: 650, total: 650 },
            ],
            subtotal: 650,
            tax: 52,
            discount: 50,
            totalAmount: 652,
            currency: 'USD',
            paymentMethod: 'DEBIT_CARD',
            paymentStatus: 'PAID',
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
          },
          {
            invoiceNumber: 'INV-2026-8804',
            memberId: 'GF-9287',
            memberName: 'David Kim',
            memberEmail: 'david.kim@example.com',
            items: [
              { description: 'Silver Monthly Membership', quantity: 1, unitPrice: 89, total: 89 },
            ],
            subtotal: 89,
            tax: 7,
            discount: 0,
            totalAmount: 96,
            currency: 'USD',
            paymentMethod: 'BANK_TRANSFER',
            paymentStatus: 'PENDING',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
          },
          {
            invoiceNumber: 'INV-2026-8805',
            memberId: 'GF-9288',
            memberName: 'Jessica Taylor',
            memberEmail: 'jessica.taylor@example.com',
            items: [
              { description: 'Monthly Locker Renewal', quantity: 1, unitPrice: 25, total: 25 },
            ],
            subtotal: 25,
            tax: 2,
            discount: 0,
            totalAmount: 27,
            currency: 'USD',
            paymentMethod: 'CREDIT_CARD',
            paymentStatus: 'OVERDUE',
            dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            tenantId: 'tenant_enterprise_01',
            branchId: 'branch_hq_01',
          },
        ];

        await InvoicesModel.insertMany(initialInvoices);
        items = await InvoicesModel.find(filter).sort({ createdAt: -1 }).exec();
      }

      res.status(200).json(BaseResponse.success({ items, total: items.length }, 'Invoices retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      let item = null;
      if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
        item = await InvoicesModel.findById(id).exec();
      }
      if (!item) {
        item = await InvoicesModel.findOne({ invoiceNumber: id }).exec();
      }
      if (!item) {
        item = await InvoicesModel.findOne().exec();
      }
      res.status(200).json(BaseResponse.success(item, 'Invoice retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const num = req.body.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const items = req.body.items && req.body.items.length > 0 ? req.body.items : [
        {
          description: req.body.name || 'Membership Plan / POS Charge',
          quantity: 1,
          unitPrice: req.body.totalAmount || 899,
          total: req.body.totalAmount || 899,
        },
      ];

      const subtotal = req.body.subtotal || items.reduce((sum: number, it: any) => sum + (it.total || it.unitPrice * (it.quantity || 1)), 0);
      const tax = req.body.tax || Math.round(subtotal * 0.08);
      const discount = req.body.discount || 0;
      const totalAmount = req.body.totalAmount || (subtotal + tax - discount);

      const created = await InvoicesModel.create({
        ...req.body,
        invoiceNumber: num,
        memberId: req.body.memberId || 'mem_default',
        memberName: req.body.memberName || 'Walk-in Customer',
        memberEmail: req.body.memberEmail || 'guest@gymflow.io',
        items,
        subtotal,
        tax,
        discount,
        totalAmount,
        currency: req.body.currency || 'USD',
        paymentMethod: req.body.paymentMethod || 'CREDIT_CARD',
        paymentStatus: req.body.paymentStatus || 'PAID',
        dueDate: req.body.dueDate || new Date().toISOString(),
        paidAt: req.body.paymentStatus === 'PAID' ? new Date().toISOString() : undefined,
        tenantId: (req as any).tenantId || req.body.tenantId || 'tenant_enterprise_01',
        branchId: (req as any).branchId || req.body.branchId || 'branch_hq_01',
        status: 'active',
      });

      res.status(201).json(BaseResponse.success(created, 'Invoice created successfully.'));
    } catch (error) {
      next(error);
    }
  };
}
