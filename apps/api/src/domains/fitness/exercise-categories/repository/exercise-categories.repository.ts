import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IExerciseCategoriesModel, ExerciseCategoriesModel } from '../model/exercise-categories.model.js';

export interface IExerciseCategoriesRepository extends IBaseRepository<IExerciseCategoriesModel> {}

export class ExerciseCategoriesRepository extends BaseRepository<IExerciseCategoriesModel> implements IExerciseCategoriesRepository {
  constructor() {
    super(ExerciseCategoriesModel);
  }
}
