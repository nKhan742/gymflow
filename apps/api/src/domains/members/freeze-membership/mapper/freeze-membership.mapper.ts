import { IFreezeMembershipModel } from '../model/freeze-membership.model.js';
import { IFreezeMembership } from '../interfaces/freeze-membership.interface.js';

export class FreezeMembershipMapper {
  static toDTO(model: IFreezeMembershipModel): IFreezeMembership {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Hold for ${model.memberName || model.memberCode}`,
      code: model.code || 'FRZ-001',
      description: model.description,
      memberId: model.memberId,
      memberCode: model.memberCode || 'GF-1001',
      memberName: model.memberName || 'Gym Member',
      memberEmail: model.memberEmail || 'member@gymflow.io',
      memberPhone: model.memberPhone || '+1 (555) 000-0000',
      planTier: model.planTier || 'GOLD_ANNUAL',
      startDate: model.startDate || new Date(),
      endDate: model.endDate || new Date(),
      durationDays: model.durationDays || 30,
      reason: model.reason || 'MEDICAL',
      freezeStatus: model.freezeStatus || 'ACTIVE_FROZEN',
      feeAmount: model.feeAmount ?? 0,
      quotaDaysUsed: model.quotaDaysUsed ?? 30,
      maxQuotaDays: model.maxQuotaDays ?? 60,
      doctorNoteAttached: model.doctorNoteAttached ?? false,
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
