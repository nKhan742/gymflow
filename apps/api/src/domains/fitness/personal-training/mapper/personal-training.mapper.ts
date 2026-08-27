import { IPersonalTrainingModel } from '../model/personal-training.model.js';
import { IPersonalTraining } from '../interfaces/personal-training.interface.js';

export class PersonalTrainingMapper {
  static toDTO(model: IPersonalTrainingModel): IPersonalTraining {
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
