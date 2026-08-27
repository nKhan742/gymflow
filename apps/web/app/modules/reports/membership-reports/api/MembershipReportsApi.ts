import { ApiService } from '@core/api/apiService';

export class MembershipReportsApi {
  private static endpoint = '/reports/membership-reports';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
