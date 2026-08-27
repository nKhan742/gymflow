import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IWorkoutAssignmentModel, WorkoutAssignmentModel } from '../model/workout-assignment.model.js';

export interface IWorkoutAssignmentRepository extends IBaseRepository<IWorkoutAssignmentModel> {}

export class WorkoutAssignmentRepository extends BaseRepository<IWorkoutAssignmentModel> implements IWorkoutAssignmentRepository {
  constructor() {
    super(WorkoutAssignmentModel);
  }
}
