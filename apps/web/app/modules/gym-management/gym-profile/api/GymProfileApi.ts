import { ApiService } from '@core/api/apiService';

export class GymProfileApi {
  private static endpoint = '/gym-management/gym-profile';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
