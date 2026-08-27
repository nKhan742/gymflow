import { ISalaryModel } from '../model/salary.model.js';
import { ISalary } from '../interfaces/salary.interface.js';

export class SalaryMapper {
  static toDTO(model: ISalaryModel): ISalary {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Salary Slip for ${model.staffName || model.staffCode}`,
      code: model.code || model.paySlipCode || 'PAY-001',
      paySlipCode: model.paySlipCode || 'PAY-2026-0001',
      staffId: model.staffId,
      staffCode: model.staffCode || 'STF-100',
      staffName: model.staffName || 'Staff Employee',
      role: model.role || 'FITNESS_COACH',
      payPeriod: model.payPeriod || 'August 2026',
      baseSalary: model.baseSalary ?? 0,
      commissionAmount: model.commissionAmount ?? 0,
      bonusAmount: model.bonusAmount ?? 0,
      deductions: model.deductions ?? 0,
      netSalary: model.netSalary ?? 0,
      currency: model.currency || 'USD',
      paymentMethod: model.paymentMethod || 'DIRECT_DEPOSIT',
      bankName: model.bankName || 'Chase Bank NA',
      accountNumber: model.accountNumber || '•••• 0000',
      disbursementStatus: model.disbursementStatus || 'DISBURSED',
      disbursementDate: model.disbursementDate || model.createdAt,
      disbursedBy: model.disbursedBy || 'Finance Director Marcus Hayes',
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
