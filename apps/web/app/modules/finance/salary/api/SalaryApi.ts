import { ApiService } from '@core/api/apiService';

export class SalaryApi {
  private static endpoint = '/finance/salary';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
