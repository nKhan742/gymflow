import { ApiService } from '@core/api/apiService';

export class TrainerDashboardApi {
  private static endpoint = '/dashboard/trainer-dashboard';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
