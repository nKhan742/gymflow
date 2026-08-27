import { ApiService } from '@core/api/apiService';

export class ActivityLogsApi {
  private static endpoint = '/administration/activity-logs';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
