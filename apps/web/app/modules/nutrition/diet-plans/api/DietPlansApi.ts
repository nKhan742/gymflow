import { ApiService } from '@core/api/apiService';

export class DietPlansApi {
  private static endpoint = '/nutrition/diet-plans';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
