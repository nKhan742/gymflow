import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ICalendarModel, CalendarModel } from '../model/calendar.model.js';

export interface ICalendarRepository extends IBaseRepository<ICalendarModel> {}

export class CalendarRepository extends BaseRepository<ICalendarModel> implements ICalendarRepository {
  constructor() {
    super(CalendarModel);
  }
}
