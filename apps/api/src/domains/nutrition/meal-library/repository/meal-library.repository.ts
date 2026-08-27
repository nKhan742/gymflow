import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IMealLibraryModel, MealLibraryModel } from '../model/meal-library.model.js';

export interface IMealLibraryRepository extends IBaseRepository<IMealLibraryModel> {}

export class MealLibraryRepository extends BaseRepository<IMealLibraryModel> implements IMealLibraryRepository {
  constructor() {
    super(MealLibraryModel);
  }
}
