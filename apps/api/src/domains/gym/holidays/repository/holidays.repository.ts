import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IHolidaysModel, HolidaysModel } from '../model/holidays.model.js';

export interface IHolidaysRepository extends IBaseRepository<IHolidaysModel> {}

export class HolidaysRepository extends BaseRepository<IHolidaysModel> implements IHolidaysRepository {
  constructor() {
    super(HolidaysModel);
  }
}
