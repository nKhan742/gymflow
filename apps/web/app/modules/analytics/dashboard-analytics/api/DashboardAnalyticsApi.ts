import { ApiService } from '@core/api/apiService';

export class DashboardAnalyticsApi {
  private static endpoint = '/analytics/dashboard-analytics';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
