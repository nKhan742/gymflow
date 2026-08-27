import { ITrainerReportsModel } from '../model/trainer-reports.model.js';
import { ITrainerReports } from '../interfaces/trainer-reports.interface.js';

export class TrainerReportsMapper {
  static toDTO(model: ITrainerReportsModel): ITrainerReports {
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
