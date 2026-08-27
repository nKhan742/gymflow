import { IWorkoutAssignmentModel } from '../model/workout-assignment.model.js';
import { IWorkoutAssignment } from '../interfaces/workout-assignment.interface.js';

export class WorkoutAssignmentMapper {
  static toDTO(model: IWorkoutAssignmentModel): IWorkoutAssignment {
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
