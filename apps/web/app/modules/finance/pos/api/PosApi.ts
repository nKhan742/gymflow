import { ApiService } from '@core/api/apiService';

export class PosApi {
  private static endpoint = '/finance/pos';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
