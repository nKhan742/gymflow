import { ApiService } from '@core/api/apiService';

export class MyProfileApi {
  private static endpoint = '/profile/my-profile';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
