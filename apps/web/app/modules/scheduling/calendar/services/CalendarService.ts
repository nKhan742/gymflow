import { CalendarApi } from '../api';

export class CalendarService {
  static async getList() {
    return CalendarApi.getAll();
  }
}
