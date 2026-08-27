import { ApiService } from '@core/api/apiService';

export class ExpensesApi {
  private static endpoint = '/finance/expenses';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
