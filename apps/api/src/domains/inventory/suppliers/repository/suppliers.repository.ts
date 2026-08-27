import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ISuppliersModel, SuppliersModel } from '../model/suppliers.model.js';

export interface ISuppliersRepository extends IBaseRepository<ISuppliersModel> {}

export class SuppliersRepository extends BaseRepository<ISuppliersModel> implements ISuppliersRepository {
  constructor() {
    super(SuppliersModel);
  }
}
