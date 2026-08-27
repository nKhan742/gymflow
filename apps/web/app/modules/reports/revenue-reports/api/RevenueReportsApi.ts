import { ApiService } from '@core/api/apiService';

export class RevenueReportsApi {
  private static endpoint = '/reports/revenue-reports';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
