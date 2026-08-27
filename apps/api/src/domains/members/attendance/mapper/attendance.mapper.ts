import { IAttendanceModel } from '../model/attendance.model.js';
import { IAttendance } from '../interfaces/attendance.interface.js';

export class AttendanceMapper {
  static toDTO(model: IAttendanceModel): IAttendance {
    return {
      id: model._id.toString(),
      _id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || `Check-in for ${model.memberName || model.memberCode}`,
      code: model.code || 'ATT-001',
      description: model.description,
      memberId: model.memberId,
      memberCode: model.memberCode || 'GF-1001',
      memberName: model.memberName || 'Gym Member',
      planTier: model.planTier || 'VIP_PLATINUM',
      checkInTime: model.checkInTime || model.createdAt,
      checkOutTime: model.checkOutTime,
      durationMinutes: model.durationMinutes || 0,
      method: model.method || 'BIOMETRIC_FACE',
      gateLocation: model.gateLocation || 'Gate A - Main Turnstile #1',
      accessResult: model.accessResult || 'GRANTED',
      turnstileCode: model.turnstileCode || 'TRN-01',
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
