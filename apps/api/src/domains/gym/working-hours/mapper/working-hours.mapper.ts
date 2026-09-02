import { IWorkingHours } from '../interfaces/working-hours.interface.js';
import { IWorkingHoursModel } from '../model/working-hours.model.js';

export class WorkingHoursMapper {
  static toDTO(doc: IWorkingHoursModel): IWorkingHours {
    return WorkingHoursMapper.toEntity(doc);
  }

  static toEntity(doc: IWorkingHoursModel): IWorkingHours {
    return {
      id: doc._id?.toString() || doc.id,
      tenantId: doc.tenantId,
      name: doc.name,
      code: doc.code,
      zoneType: doc.zoneType,
      is24x7: doc.is24x7,
      weeklySchedule: doc.weeklySchedule || [],
      peakHoursStart: doc.peakHoursStart,
      peakHoursEnd: doc.peakHoursEnd,
      maxCapacity: doc.maxCapacity,
      maintenanceWindow: doc.maintenanceWindow,
      branchId: doc.branchId,
      branchName: doc.branchName,
      status: doc.status,
      description: doc.description,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toEntityList(docs: IWorkingHoursModel[]): IWorkingHours[] {
    return docs.map((doc) => WorkingHoursMapper.toEntity(doc));
  }
}
