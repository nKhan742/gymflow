import { ApiService } from '@core/api/apiService';

export class MemberDashboardApi {
  private static endpoint = '/dashboard/member-dashboard';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
