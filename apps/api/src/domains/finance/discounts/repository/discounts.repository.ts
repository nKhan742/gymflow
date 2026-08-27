import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IDiscountsModel, DiscountsModel } from '../model/discounts.model.js';

export interface IDiscountsRepository extends IBaseRepository<IDiscountsModel> {}

export class DiscountsRepository extends BaseRepository<IDiscountsModel> implements IDiscountsRepository {
  constructor() {
    super(DiscountsModel);
  }
}
