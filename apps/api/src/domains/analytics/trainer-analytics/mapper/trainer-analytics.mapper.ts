import { ITrainerAnalyticsModel } from '../model/trainer-analytics.model.js';
import { ITrainerAnalytics } from '../interfaces/trainer-analytics.interface.js';

export class TrainerAnalyticsMapper {
  static toDTO(model: ITrainerAnalyticsModel): ITrainerAnalytics {
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
