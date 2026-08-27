import { IExpensesModel } from '../model/expenses.model.js';
import { IExpenses } from '../interfaces/expenses.interface.js';

export class ExpensesMapper {
  static toDTO(model: IExpensesModel): IExpenses {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || model.title || `Expense ${model.voucherCode || model.code}`,
      code: model.code || model.voucherCode || 'EXP-001',
      voucherCode: model.voucherCode || 'EXP-7001',
      vendorName: model.vendorName || 'General Vendor',
      category: model.category || 'EQUIPMENT_MAINTENANCE',
      title: model.title || 'Gym Operational Expense',
      description: model.description,
      amount: model.amount ?? 0,
      taxAmount: model.taxAmount ?? 0,
      totalAmount: model.totalAmount ?? 0,
      currency: model.currency || 'USD',
      paymentMethod: model.paymentMethod || 'CORPORATE_CARD',
      paymentStatus: model.paymentStatus || 'PAID',
      expenseDate: model.expenseDate || model.createdAt,
      dueDate: model.dueDate,
      recordedBy: model.recordedBy || 'Manager Alex Vance',
      approvedBy: model.approvedBy || 'Director Marcus Hayes',
      receiptFileName: model.receiptFileName,
      receiptUrl: model.receiptUrl,
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
