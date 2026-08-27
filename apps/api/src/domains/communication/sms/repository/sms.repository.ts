import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ISmsModel, SmsModel } from '../model/sms.model.js';

export interface ISmsRepository extends IBaseRepository<ISmsModel> {}

export class SmsRepository extends BaseRepository<ISmsModel> implements ISmsRepository {
  constructor() {
    super(SmsModel);
  }
}
