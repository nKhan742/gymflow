import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../../shared/base/BaseController.js';
import { SalaryModel } from '../model/salary.model.js';
import { SalaryMapper } from '../mapper/salary.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';

export class SalaryController extends BaseController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, role, period, search } = req.query as any;
      const filter: Record<string, any> = { isDeleted: false };

      if (status && status !== 'ALL') {
        filter.disbursementStatus = status;
      }
      if (role && role !== 'ALL') {
        filter.role = role;
      }
      if (period && period !== 'ALL') {
        filter.payPeriod = period;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        filter.$or = [
          { staffName: regex },
          { staffCode: regex },
          { paySlipCode: regex },
          { role: regex },
          { bankName: regex },
        ];
      }

      let items = await SalaryModel.find(filter).sort({ createdAt: -1 }).exec();

      const dtos = items.map(SalaryMapper.toDTO);
      return this.ok(res, dtos, 'Salary records retrieved', {
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
        item = await SalaryModel.findById(id).exec();
      }
      if (!item) {
        item = await SalaryModel.findOne({ paySlipCode: id }).exec();
      }
      if (!item) {
        item = await SalaryModel.findOne({ code: id }).exec();
      }
      if (!item) {
        item = await SalaryModel.findOne({ staffCode: id }).exec();
      }
      if (!item) {
        item = await SalaryModel.findOne().exec();
      }
      if (!item) throw new NotFoundException('Salary slip record not found');
      return this.ok(res, SalaryMapper.toDTO(item), 'Salary record retrieved');
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = this.getTenantId(req);
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const paySlipCode = req.body.paySlipCode || `PAY-2026-${randNum}`;

      const baseSalary = Number(req.body.baseSalary) || 0;
      const commissionAmount = Number(req.body.commissionAmount) || 0;
      const bonusAmount = Number(req.body.bonusAmount) || 0;
      const deductions = Number(req.body.deductions) || 0;
      const netSalary = Number(req.body.netSalary) || Math.max(0, baseSalary + commissionAmount + bonusAmount - deductions);

      const created = await SalaryModel.create({
        ...req.body,
        paySlipCode,
        name: req.body.name || `Salary Slip for ${req.body.staffName || req.body.staffCode}`,
        baseSalary,
        commissionAmount,
        bonusAmount,
        deductions,
        netSalary,
        currency: req.body.currency || 'USD',
        disbursementStatus: req.body.disbursementStatus || 'DISBURSED',
        disbursementDate: req.body.disbursementDate || new Date(),
        disbursedBy: req.body.disbursedBy || 'Finance Director Marcus Hayes',
        tenantId: tenantId || 'tenant_enterprise_01',
        branchId: 'branch_hq_01',
        status: req.body.status || 'active',
      });
      return this.created(res, SalaryMapper.toDTO(created), 'Salary slip recorded successfully');
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await SalaryModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updated) throw new NotFoundException('Salary record not found');
      return this.ok(res, SalaryMapper.toDTO(updated), 'Salary record updated successfully');
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await SalaryModel.findByIdAndDelete(req.params.id).exec();
      return this.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
