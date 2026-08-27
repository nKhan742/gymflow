import { IAttendanceAnalyticsModel } from '../model/attendance-analytics.model.js';
import { IAttendanceAnalytics } from '../interfaces/attendance-analytics.interface.js';

export class AttendanceAnalyticsMapper {
  static toDTO(model: IAttendanceAnalyticsModel): IAttendanceAnalytics {
    return {
      id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name,
      code: model.code,
      description: model.description,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
