import { ApiService } from '@core/api/apiService';

export class AdminDashboardApi {
  private static endpoint = '/dashboard/admin-dashboard';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
