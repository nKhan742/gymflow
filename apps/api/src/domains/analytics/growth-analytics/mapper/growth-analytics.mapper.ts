import { IGrowthAnalyticsModel } from '../model/growth-analytics.model.js';
import { IGrowthAnalytics } from '../interfaces/growth-analytics.interface.js';

export class GrowthAnalyticsMapper {
  static toDTO(model: IGrowthAnalyticsModel): IGrowthAnalytics {
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
