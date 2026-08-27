import { IDiscountsModel } from '../model/discounts.model.js';
import { IDiscounts } from '../interfaces/discounts.interface.js';

export class DiscountsMapper {
  static toDTO(model: IDiscountsModel): IDiscounts {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || model.title || `Discount ${model.promoCode || model.code}`,
      code: model.code || model.promoCode || 'DISC-001',
      description: model.description,
      promoCode: model.promoCode || 'PROMO10',
      title: model.title || 'Gym Promotional Discount',
      discountType: model.discountType || 'PERCENTAGE',
      discountValue: model.discountValue ?? 10,
      currency: model.currency || 'USD',
      applicableDomain: model.applicableDomain || 'ALL_MEMBERSHIPS',
      minPurchaseAmount: model.minPurchaseAmount ?? 0,
      maxUsageCount: model.maxUsageCount ?? 100,
      usedCount: model.usedCount ?? 0,
      startDate: model.startDate || model.createdAt,
      expiryDate: model.expiryDate,
      isActive: model.isActive ?? true,
      createdBy: model.createdBy || 'Marketing Lead Chloe Bennett',
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
