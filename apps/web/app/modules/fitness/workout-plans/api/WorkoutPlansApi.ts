import { ApiService } from '@core/api/apiService';

export class WorkoutPlansApi {
  private static endpoint = '/fitness/workout-plans';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
