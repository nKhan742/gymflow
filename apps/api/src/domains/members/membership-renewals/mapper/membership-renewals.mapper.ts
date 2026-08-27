import { IMembershipRenewalsModel } from '../model/membership-renewals.model.js';
import { IMembershipRenewals } from '../interfaces/membership-renewals.interface.js';

export class MembershipRenewalsMapper {
  static toDTO(model: IMembershipRenewalsModel): IMembershipRenewals {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Renewal for ${model.memberName || model.memberCode}`,
      code: model.code || 'RNW-001',
      memberId: model.memberId,
      memberCode: model.memberCode || 'GF-1001',
      memberName: model.memberName || 'Gym Member',
      memberEmail: model.memberEmail || 'member@gymflow.io',
      memberPhone: model.memberPhone || '+1 (555) 000-0000',
      currentPlan: model.currentPlan || 'Gold Annual All-Access',
      currentTier: model.currentTier || 'GOLD_ANNUAL',
      expiryDate: model.expiryDate || new Date(),
      daysRemaining: model.daysRemaining ?? 7,
      renewalStatus: model.renewalStatus || 'EXPIRING_SOON',
      amount: model.amount ?? 899,
      currency: model.currency || 'USD',
      autoRenew: model.autoRenew ?? true,
      paymentMethod: model.paymentMethod || 'STRIPE_CARD',
      lastContactDate: model.lastContactDate,
      contactChannel: model.contactChannel || 'EMAIL',
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
