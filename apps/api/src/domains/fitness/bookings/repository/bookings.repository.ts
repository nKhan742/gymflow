import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IBookingsModel, BookingsModel } from '../model/bookings.model.js';

export interface IBookingsRepository extends IBaseRepository<IBookingsModel> {}

export class BookingsRepository extends BaseRepository<IBookingsModel> implements IBookingsRepository {
  constructor() {
    super(BookingsModel);
  }
}
