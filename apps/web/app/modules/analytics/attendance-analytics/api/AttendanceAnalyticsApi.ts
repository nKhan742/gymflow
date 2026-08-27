import { ApiService } from '@core/api/apiService';

export class AttendanceAnalyticsApi {
  private static endpoint = '/analytics/attendance-analytics';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
