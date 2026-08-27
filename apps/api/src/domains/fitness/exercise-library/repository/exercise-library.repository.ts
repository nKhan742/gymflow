import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IExerciseLibraryModel, ExerciseLibraryModel } from '../model/exercise-library.model.js';

export interface IExerciseLibraryRepository extends IBaseRepository<IExerciseLibraryModel> {}

export class ExerciseLibraryRepository extends BaseRepository<IExerciseLibraryModel> implements IExerciseLibraryRepository {
  constructor() {
    super(ExerciseLibraryModel);
  }
}
