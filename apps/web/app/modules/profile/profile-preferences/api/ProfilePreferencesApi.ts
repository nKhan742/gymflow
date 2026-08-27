import { ApiService } from '@core/api/apiService';

export class ProfilePreferencesApi {
  private static endpoint = '/profile/profile-preferences';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
