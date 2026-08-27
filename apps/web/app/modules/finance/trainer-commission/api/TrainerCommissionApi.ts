import { ApiService } from '@core/api/apiService';

export class TrainerCommissionApi {
  private static endpoint = '/finance/trainer-commission';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
