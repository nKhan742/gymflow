import { IMemberReportsModel } from '../model/member-reports.model.js';
import { IMemberReports } from '../interfaces/member-reports.interface.js';

export class MemberReportsMapper {
  static toDTO(model: IMemberReportsModel): IMemberReports {
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
