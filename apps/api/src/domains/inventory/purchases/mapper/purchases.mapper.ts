import { IPurchasesModel } from '../model/purchases.model.js';
import { IPurchases } from '../interfaces/purchases.interface.js';

export class PurchasesMapper {
  static toDTO(model: IPurchasesModel): IPurchases {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `PO #${model.purchaseOrderNumber || model.code}`,
      code: model.code || model.purchaseOrderNumber || 'PO-001',
      description: model.description,
      purchaseOrderNumber: model.purchaseOrderNumber || 'PO-2026-0001',
      supplierId: model.supplierId,
      supplierCode: model.supplierCode || 'SUP-101',
      supplierName: model.supplierName || 'Optimum Nutrition HQ',
      orderDate: model.orderDate || model.createdAt,
      expectedDeliveryDate: model.expectedDeliveryDate,
      itemCount: model.itemCount ?? 1,
      items: model.items,
      subtotal: model.subtotal ?? 0,
      tax: model.tax ?? 0,
      shippingCost: model.shippingCost ?? 0,
      totalAmount: model.totalAmount ?? 0,
      currency: model.currency || 'USD',
      paymentStatus: model.paymentStatus || 'PAID',
      orderStatus: model.orderStatus || 'RECEIVED',
      receivedDate: model.receivedDate,
      receivedBy: model.receivedBy || 'General Manager Chloe Bennett',
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
