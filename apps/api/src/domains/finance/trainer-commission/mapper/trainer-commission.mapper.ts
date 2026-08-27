import { ITrainerCommissionModel } from '../model/trainer-commission.model.js';
import { ITrainerCommission } from '../interfaces/trainer-commission.interface.js';

export class TrainerCommissionMapper {
  static toDTO(model: ITrainerCommissionModel): ITrainerCommission {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Commission for ${model.trainerName || model.trainerCode}`,
      code: model.code || model.commissionCode || 'COM-001',
      description: model.description,
      commissionCode: model.commissionCode || 'COM-9001',
      trainerId: model.trainerId,
      trainerCode: model.trainerCode || 'STF-101',
      trainerName: model.trainerName || 'Coach Alex Vance',
      role: model.role || 'HEAD_TRAINER',
      clientMemberCode: model.clientMemberCode,
      clientMemberName: model.clientMemberName,
      commissionType: model.commissionType || '1_ON_1_PERSONAL_TRAINING',
      sessionTitle: model.sessionTitle || 'Personal Training Session',
      billedAmount: model.billedAmount ?? 0,
      commissionRate: model.commissionRate ?? 50,
      commissionEarned: model.commissionEarned ?? 0,
      currency: model.currency || 'USD',
      sessionCount: model.sessionCount ?? 1,
      sessionDate: model.sessionDate || model.createdAt,
      payoutStatus: model.payoutStatus || 'SETTLED',
      payoutDate: model.payoutDate,
      approvedBy: model.approvedBy || 'General Manager Chloe Bennett',
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
