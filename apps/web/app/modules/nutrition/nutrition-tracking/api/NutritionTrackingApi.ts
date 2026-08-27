import { ApiService } from '@core/api/apiService';

export class NutritionTrackingApi {
  private static endpoint = '/nutrition/nutrition-tracking';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
