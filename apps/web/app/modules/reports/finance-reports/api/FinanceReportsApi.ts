import { ApiService } from '@core/api/apiService';

export class FinanceReportsApi {
  private static endpoint = '/reports/finance-reports';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
