import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IPurchasesModel, PurchasesModel } from '../model/purchases.model.js';

export interface IPurchasesRepository extends IBaseRepository<IPurchasesModel> {}

export class PurchasesRepository extends BaseRepository<IPurchasesModel> implements IPurchasesRepository {
  constructor() {
    super(PurchasesModel);
  }
}
