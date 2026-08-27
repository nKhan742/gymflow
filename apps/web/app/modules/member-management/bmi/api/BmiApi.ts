import { ApiService } from '@core/api/apiService';

export class BmiApi {
  private static endpoint = '/member-management/bmi';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
