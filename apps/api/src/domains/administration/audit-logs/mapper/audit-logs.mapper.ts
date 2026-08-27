import { IAuditLogsModel } from '../model/audit-logs.model.js';
import { IAuditLogs } from '../interfaces/audit-logs.interface.js';

export class AuditLogsMapper {
  static toDTO(model: IAuditLogsModel): IAuditLogs {
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
