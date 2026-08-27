import { IMembershipPlansModel } from '../model/membership-plans.model.js';
import { IMembershipPlans } from '../interfaces/membership-plans.interface.js';

export class MembershipPlansMapper {
  static toDTO(model: IMembershipPlansModel): IMembershipPlans {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name,
      code: model.code || 'PLAN-001',
      description: model.description || 'Comprehensive fitness membership plan',
      tier: model.tier || 'GOLD_ANNUAL',
      price: model.price || 899,
      currency: model.currency || 'USD',
      billingCycle: model.billingCycle || 'ANNUAL',
      initiationFee: model.initiationFee || 0,
      accessHours: model.accessHours || '24/7 All-Access',
      multiBranch: !!model.multiBranch,
      inclusions: model.inclusions || [
        'Full gym floor & cardio deck access',
        'Locker room & shower access',
      ],
      maxFreezeDays: model.maxFreezeDays || 30,
      popular: !!model.popular,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
