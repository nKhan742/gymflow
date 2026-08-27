import { ApiService } from '@core/api/apiService';

export class MealLibraryApi {
  private static endpoint = '/nutrition/meal-library';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
