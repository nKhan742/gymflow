import { IPaymentsModel } from '../model/payments.model.js';
import { IPayments } from '../interfaces/payments.interface.js';

export class PaymentsMapper {
  static toDTO(model: IPaymentsModel): IPayments {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Payment ${model.transactionCode || model.code}`,
      code: model.code || model.transactionCode || 'TXN-001',
      transactionCode: model.transactionCode || 'TXN-1000',
      invoiceNumber: model.invoiceNumber || 'INV-2026-0001',
      description: model.description,
      memberId: model.memberId,
      memberCode: model.memberCode || 'GF-1001',
      memberName: model.memberName || 'Gym Member',
      planTier: model.planTier || 'VIP_PLATINUM',
      category: model.category || 'MEMBERSHIP_RENEWAL',
      amount: model.amount ?? 0,
      taxAmount: model.taxAmount ?? 0,
      discountAmount: model.discountAmount ?? 0,
      totalAmount: model.totalAmount ?? 0,
      currency: model.currency || 'USD',
      paymentMethod: model.paymentMethod || 'CREDIT_CARD',
      paymentGateway: model.paymentGateway || 'Stripe',
      gatewayTransactionId: model.gatewayTransactionId,
      paymentStatus: model.paymentStatus || 'COMPLETED',
      paymentDate: model.paymentDate || model.createdAt,
      collectedBy: model.collectedBy || 'Desk Cashier Alex Vance',
      receiptUrl: model.receiptUrl,
      notes: model.notes,
      refundReason: model.refundReason,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
