import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IWorkoutTemplatesModel, WorkoutTemplatesModel } from '../model/workout-templates.model.js';

export interface IWorkoutTemplatesRepository extends IBaseRepository<IWorkoutTemplatesModel> {}

export class WorkoutTemplatesRepository extends BaseRepository<IWorkoutTemplatesModel> implements IWorkoutTemplatesRepository {
  constructor() {
    super(WorkoutTemplatesModel);
  }
}
