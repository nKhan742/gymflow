import { IBmiModel } from '../model/bmi.model.js';
import { IBmi } from '../interfaces/bmi.interface.js';

export class BmiMapper {
  static toDTO(model: IBmiModel): IBmi {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Assessment for ${model.memberName || model.memberCode}`,
      code: model.code || 'BMI-001',
      description: model.description,
      memberId: model.memberId,
      memberCode: model.memberCode || 'GF-1001',
      memberName: model.memberName || 'Gym Member',
      planTier: model.planTier || 'VIP_PLATINUM',
      gender: model.gender || 'FEMALE',
      age: model.age || 28,
      heightCm: model.heightCm || 170,
      weightKg: model.weightKg || 70,
      bmi: model.bmi || 24.2,
      bmiCategory: model.bmiCategory || 'NORMAL',
      bodyFatPercent: model.bodyFatPercent || 20,
      muscleMassKg: model.muscleMassKg || 32,
      visceralFat: model.visceralFat || 4,
      bmrKcal: model.bmrKcal || 1600,
      assessmentDate: model.assessmentDate || model.createdAt,
      assessedBy: model.assessedBy || 'Coach Alex Vance',
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
