import { IWaterIntakeModel } from '../model/water-intake.model.js';
import { IWaterIntake } from '../interfaces/water-intake.interface.js';

export class WaterIntakeMapper {
  static toDTO(model: IWaterIntakeModel): IWaterIntake {
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
