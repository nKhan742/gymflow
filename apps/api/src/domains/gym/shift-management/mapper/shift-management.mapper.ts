import { IShiftManagement } from '../interfaces/shift-management.interface.js';
import { IShiftManagementModel } from '../model/shift-management.model.js';

export class ShiftManagementMapper {
  static toDTO(doc: IShiftManagementModel): IShiftManagement {
    return ShiftManagementMapper.toEntity(doc);
  }

  static toEntity(doc: IShiftManagementModel): IShiftManagement {
    return {
      id: doc._id?.toString() || doc.id,
      tenantId: doc.tenantId,
      name: doc.name,
      code: doc.code,
      departmentId: doc.departmentId,
      departmentName: doc.departmentName,
      startTime: doc.startTime,
      endTime: doc.endTime,
      durationHours: doc.durationHours,
      breakDurationMins: doc.breakDurationMins,
      minHeadcount: doc.minHeadcount,
      daysOfWeek: doc.daysOfWeek || [],
      gracePeriodMins: doc.gracePeriodMins,
      overtimeMultiplier: doc.overtimeMultiplier,
      color: doc.color,
      branchId: doc.branchId,
      branchName: doc.branchName,
      status: doc.status,
      description: doc.description,
      assignedStaffCount: doc.assignedStaffCount,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toEntityList(docs: IShiftManagementModel[]): IShiftManagement[] {
    return docs.map((doc) => ShiftManagementMapper.toEntity(doc));
  }
}
