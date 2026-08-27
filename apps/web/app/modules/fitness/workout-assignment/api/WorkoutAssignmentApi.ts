import { ApiService } from '@core/api/apiService';

export class WorkoutAssignmentApi {
  private static endpoint = '/fitness/workout-assignment';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
