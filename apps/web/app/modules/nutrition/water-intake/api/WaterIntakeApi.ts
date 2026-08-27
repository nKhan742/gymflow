import { ApiService } from '@core/api/apiService';

export class WaterIntakeApi {
  private static endpoint = '/nutrition/water-intake';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
