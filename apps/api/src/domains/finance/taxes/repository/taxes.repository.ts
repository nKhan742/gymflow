import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ITaxesModel, TaxesModel } from '../model/taxes.model.js';

export interface ITaxesRepository extends IBaseRepository<ITaxesModel> {}

export class TaxesRepository extends BaseRepository<ITaxesModel> implements ITaxesRepository {
  constructor() {
    super(TaxesModel);
  }
}
