import { ITrainerScheduleModel } from '../model/trainer-schedule.model.js';
import { ITrainerSchedule } from '../interfaces/trainer-schedule.interface.js';

export class TrainerScheduleMapper {
  static toDTO(model: ITrainerScheduleModel): ITrainerSchedule {
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
