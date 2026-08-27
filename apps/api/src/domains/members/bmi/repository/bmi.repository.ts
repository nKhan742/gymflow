import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IBmiModel, BmiModel } from '../model/bmi.model.js';

export interface IBmiRepository extends IBaseRepository<IBmiModel> {}

export class BmiRepository extends BaseRepository<IBmiModel> implements IBmiRepository {
  constructor() {
    super(BmiModel);
  }
}
