import { ApiService } from '@core/api/apiService';

export class FitnessAssessmentApi {
  private static endpoint = '/fitness/fitness-assessment';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
