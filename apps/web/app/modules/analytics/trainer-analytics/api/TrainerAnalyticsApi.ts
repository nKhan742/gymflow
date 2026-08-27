import { ApiService } from '@core/api/apiService';

export class TrainerAnalyticsApi {
  private static endpoint = '/analytics/trainer-analytics';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
