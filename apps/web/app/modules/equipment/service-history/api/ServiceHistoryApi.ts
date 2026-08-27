import { ApiService } from '@core/api/apiService';

export class ServiceHistoryApi {
  private static endpoint = '/equipment/service-history';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
