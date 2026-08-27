import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IWorkoutPlansModel, WorkoutPlansModel } from '../model/workout-plans.model.js';

export interface IWorkoutPlansRepository extends IBaseRepository<IWorkoutPlansModel> {}

export class WorkoutPlansRepository extends BaseRepository<IWorkoutPlansModel> implements IWorkoutPlansRepository {
  constructor() {
    super(WorkoutPlansModel);
  }
}
