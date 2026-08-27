import { IWorkoutTemplatesModel } from '../model/workout-templates.model.js';
import { IWorkoutTemplates } from '../interfaces/workout-templates.interface.js';

export class WorkoutTemplatesMapper {
  static toDTO(model: IWorkoutTemplatesModel): IWorkoutTemplates {
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
