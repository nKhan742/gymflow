import { ApiService } from '@core/api/apiService';

export class HolidaysApi {
  private static endpoint = '/gym-management/holidays';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
