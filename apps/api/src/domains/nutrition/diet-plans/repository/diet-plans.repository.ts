import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IDietPlansModel, DietPlansModel } from '../model/diet-plans.model.js';

export interface IDietPlansRepository extends IBaseRepository<IDietPlansModel> {}

export class DietPlansRepository extends BaseRepository<IDietPlansModel> implements IDietPlansRepository {
  constructor() {
    super(DietPlansModel);
  }
}
