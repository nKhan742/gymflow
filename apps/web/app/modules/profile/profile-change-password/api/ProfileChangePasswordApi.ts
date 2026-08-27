import { ApiService } from '@core/api/apiService';

export class ProfileChangePasswordApi {
  private static endpoint = '/profile/profile-change-password';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
