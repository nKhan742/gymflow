import { ApiService } from '@core/api/apiService';

export class WorkoutTemplatesApi {
  private static endpoint = '/fitness/workout-templates';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
