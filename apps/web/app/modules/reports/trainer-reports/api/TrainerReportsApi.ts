import { ApiService } from '@core/api/apiService';

export class TrainerReportsApi {
  private static endpoint = '/reports/trainer-reports';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
