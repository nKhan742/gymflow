import { IDietPlansModel } from '../model/diet-plans.model.js';
import { IDietPlans } from '../interfaces/diet-plans.interface.js';

export class DietPlansMapper {
  static toDTO(model: IDietPlansModel): IDietPlans {
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
