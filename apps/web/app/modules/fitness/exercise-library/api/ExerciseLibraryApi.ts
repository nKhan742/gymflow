import { ApiService } from '@core/api/apiService';

export class ExerciseLibraryApi {
  private static endpoint = '/fitness/exercise-library';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
