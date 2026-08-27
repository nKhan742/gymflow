import { IInvoicesModel } from '../model/invoices.model.js';
import { IInvoices } from '../interfaces/invoices.interface.js';

export class InvoicesMapper {
  static toDTO(model: IInvoicesModel): IInvoices {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || model.invoiceNumber,
      code: model.code || model.invoiceNumber,
      description: model.description || model.memberName,
      invoiceNumber: model.invoiceNumber,
      memberId: model.memberId,
      memberName: model.memberName,
      memberEmail: model.memberEmail,
      items: model.items || [],
      subtotal: model.subtotal || model.totalAmount || 0,
      tax: model.tax || 0,
      discount: model.discount || 0,
      totalAmount: model.totalAmount || 0,
      currency: model.currency || 'USD',
      paymentMethod: model.paymentMethod || 'CREDIT_CARD',
      paymentStatus: model.paymentStatus || 'PAID',
      dueDate: model.dueDate || model.createdAt?.toISOString() || new Date().toISOString(),
      paidAt: model.paidAt,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
