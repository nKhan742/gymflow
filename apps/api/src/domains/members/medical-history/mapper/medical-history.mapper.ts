import { IMedicalHistoryModel } from '../model/medical-history.model.js';
import { IMedicalHistory } from '../interfaces/medical-history.interface.js';

export class MedicalHistoryMapper {
  static toDTO(model: IMedicalHistoryModel): IMedicalHistory {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Medical Profile for ${model.memberName || model.memberCode}`,
      code: model.code || 'MED-001',
      description: model.description,
      memberId: model.memberId,
      memberCode: model.memberCode || 'GF-1001',
      memberName: model.memberName || 'Gym Member',
      planTier: model.planTier || 'VIP_PLATINUM',
      clearanceLevel: model.clearanceLevel || 'CLEARANCE_GRANTED',
      bloodGroup: model.bloodGroup || 'O+',
      chronicConditions: model.chronicConditions || [],
      allergies: model.allergies || [],
      injuriesAndRestrictions: model.injuriesAndRestrictions || 'No restrictions.',
      currentMedications: model.currentMedications,
      physicianName: model.physicianName,
      physicianPhone: model.physicianPhone,
      waiverSigned: model.waiverSigned ?? true,
      lastReviewDate: model.lastReviewDate || model.createdAt,
      reviewedBy: model.reviewedBy || 'Coach Alex Vance',
      emergencyNotes: model.emergencyNotes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
