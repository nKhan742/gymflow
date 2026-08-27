import { IBodyMeasurementsModel } from '../model/body-measurements.model.js';
import { IBodyMeasurements } from '../interfaces/body-measurements.interface.js';

export class BodyMeasurementsMapper {
  static toDTO(model: IBodyMeasurementsModel): IBodyMeasurements {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Measurements for ${model.memberName || model.memberCode}`,
      code: model.code || 'BMS-001',
      description: model.description,
      memberId: model.memberId,
      memberCode: model.memberCode || 'GF-1001',
      memberName: model.memberName || 'Gym Member',
      planTier: model.planTier || 'VIP_PLATINUM',
      measurementDate: model.measurementDate || model.createdAt,
      unit: model.unit || 'CM',
      chest: model.chest || 100,
      shoulders: model.shoulders || 115,
      leftArm: model.leftArm || 34,
      rightArm: model.rightArm || 34.5,
      waist: model.waist || 78,
      hips: model.hips || 98,
      leftThigh: model.leftThigh || 56,
      rightThigh: model.rightThigh || 56.5,
      calves: model.calves || 37,
      waistToHipRatio: model.waistToHipRatio || 0.79,
      whrCategory: model.whrCategory || 'LOW_RISK',
      measuredBy: model.measuredBy || 'Coach Alex Vance',
      notes: model.notes,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
