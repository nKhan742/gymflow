import { ApiService } from '@core/api/apiService';

export class WorkingHoursApi {
  private static endpoint = '/gym-management/working-hours';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
