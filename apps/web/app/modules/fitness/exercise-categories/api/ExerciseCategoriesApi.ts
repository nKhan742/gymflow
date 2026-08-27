import { ApiService } from '@core/api/apiService';

export class ExerciseCategoriesApi {
  private static endpoint = '/fitness/exercise-categories';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
