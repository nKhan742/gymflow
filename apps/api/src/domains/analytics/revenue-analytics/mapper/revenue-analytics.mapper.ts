import { IRevenueAnalyticsModel } from '../model/revenue-analytics.model.js';
import { IRevenueAnalytics } from '../interfaces/revenue-analytics.interface.js';

export class RevenueAnalyticsMapper {
  static toDTO(model: IRevenueAnalyticsModel): IRevenueAnalytics {
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
