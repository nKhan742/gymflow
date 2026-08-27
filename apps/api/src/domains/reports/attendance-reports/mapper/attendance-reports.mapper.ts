import { IAttendanceReportsModel } from '../model/attendance-reports.model.js';
import { IAttendanceReports } from '../interfaces/attendance-reports.interface.js';

export class AttendanceReportsMapper {
  static toDTO(model: IAttendanceReportsModel): IAttendanceReports {
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
