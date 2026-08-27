import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ICategoriesModel, CategoriesModel } from '../model/categories.model.js';

export interface ICategoriesRepository extends IBaseRepository<ICategoriesModel> {}

export class CategoriesRepository extends BaseRepository<ICategoriesModel> implements ICategoriesRepository {
  constructor() {
    super(CategoriesModel);
  }
}
