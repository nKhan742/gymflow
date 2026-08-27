import { ApiService } from '@core/api/apiService';

export class CalendarApi {
  private static endpoint = '/scheduling/calendar';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
