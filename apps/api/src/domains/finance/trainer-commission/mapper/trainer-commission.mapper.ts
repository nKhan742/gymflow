import { ITrainerCommissionModel } from '../model/trainer-commission.model.js';
import { ITrainerCommission } from '../interfaces/trainer-commission.interface.js';

export class TrainerCommissionMapper {
  static toDTO(model: ITrainerCommissionModel): ITrainerCommission {
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
