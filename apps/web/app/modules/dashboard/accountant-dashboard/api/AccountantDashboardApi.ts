import { ApiService } from '@core/api/apiService';

export class AccountantDashboardApi {
  private static endpoint = '/dashboard/accountant-dashboard';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
