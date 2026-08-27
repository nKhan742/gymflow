import { IMemberAnalyticsModel } from '../model/member-analytics.model.js';
import { IMemberAnalytics } from '../interfaces/member-analytics.interface.js';

export class MemberAnalyticsMapper {
  static toDTO(model: IMemberAnalyticsModel): IMemberAnalytics {
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
