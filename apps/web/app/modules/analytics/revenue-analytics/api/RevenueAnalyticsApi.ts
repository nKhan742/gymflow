import { ApiService } from '@core/api/apiService';

export class RevenueAnalyticsApi {
  private static endpoint = '/analytics/revenue-analytics';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
