import { ApiService } from '@core/api/apiService';

export class NutritionDashboardApi {
  private static endpoint = '/dashboard/nutrition-dashboard';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
