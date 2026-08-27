import { ApiService } from '@core/api/apiService';

export class ClassBookingApi {
  private static endpoint = '/fitness/class-booking';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
