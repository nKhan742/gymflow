import { ApiService } from '@core/api/apiService';

export class AppointmentsApi {
  private static endpoint = '/scheduling/appointments';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
