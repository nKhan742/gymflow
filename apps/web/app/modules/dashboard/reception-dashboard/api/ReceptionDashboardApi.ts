import { ApiService } from '@core/api/apiService';

export class ReceptionDashboardApi {
  private static endpoint = '/dashboard/reception-dashboard';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
