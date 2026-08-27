import { IServiceHistoryModel } from '../model/service-history.model.js';
import { IServiceHistory } from '../interfaces/service-history.interface.js';

export class ServiceHistoryMapper {
  static toDTO(model: IServiceHistoryModel): IServiceHistory {
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
