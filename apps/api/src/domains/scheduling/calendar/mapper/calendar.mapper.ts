import { ICalendarModel } from '../model/calendar.model.js';
import { ICalendar } from '../interfaces/calendar.interface.js';

export class CalendarMapper {
  static toDTO(model: ICalendarModel): ICalendar {
    return {
      id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name,
      code: model.code,
      description: model.description,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
