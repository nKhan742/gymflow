import { ApiService } from '@core/api/apiService';

export class MemberAnalyticsApi {
  private static endpoint = '/analytics/member-analytics';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
