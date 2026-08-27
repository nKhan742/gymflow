import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ICouponsModel, CouponsModel } from '../model/coupons.model.js';

export interface ICouponsRepository extends IBaseRepository<ICouponsModel> {}

export class CouponsRepository extends BaseRepository<ICouponsModel> implements ICouponsRepository {
  constructor() {
    super(CouponsModel);
  }
}
