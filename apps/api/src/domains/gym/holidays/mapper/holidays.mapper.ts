import { IHolidays } from '../interfaces/holidays.interface.js';
import { IHolidaysModel } from '../model/holidays.model.js';

export class HolidaysMapper {
  static toDTO(doc: IHolidaysModel): IHolidays {
    return HolidaysMapper.toEntity(doc);
  }

  static toEntity(doc: IHolidaysModel): IHolidays {
    return {
      id: doc._id?.toString() || doc.id,
      tenantId: doc.tenantId,
      name: doc.name,
      code: doc.code,
      startDate: doc.startDate,
      endDate: doc.endDate,
      category: doc.category,
      operationalMode: doc.operationalMode,
      reducedHoursSchedule: doc.reducedHoursSchedule,
      classPolicy: doc.classPolicy,
      ptPolicy: doc.ptPolicy,
      branchId: doc.branchId,
      branchName: doc.branchName,
      memberBroadcast: doc.memberBroadcast,
      status: doc.status,
      description: doc.description,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toEntityList(docs: IHolidaysModel[]): IHolidays[] {
    return docs.map((doc) => HolidaysMapper.toEntity(doc));
  }
}
