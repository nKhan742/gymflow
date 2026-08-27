import { ApiService } from '@core/api/apiService';

export class PersonalTrainingApi {
  private static endpoint = '/fitness/personal-training';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
