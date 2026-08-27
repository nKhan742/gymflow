import { IActivityLogsModel } from '../model/activity-logs.model.js';
import { IActivityLogs } from '../interfaces/activity-logs.interface.js';

export class ActivityLogsMapper {
  static toDTO(model: IActivityLogsModel): IActivityLogs {
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
