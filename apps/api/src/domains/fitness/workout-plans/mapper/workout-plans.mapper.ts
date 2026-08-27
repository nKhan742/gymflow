import { IWorkoutPlansModel } from '../model/workout-plans.model.js';
import { IWorkoutPlans } from '../interfaces/workout-plans.interface.js';

export class WorkoutPlansMapper {
  static toDTO(model: IWorkoutPlansModel): IWorkoutPlans {
    return {
      id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name || model.title,
      code: model.code || model.title,
      description: model.description,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
