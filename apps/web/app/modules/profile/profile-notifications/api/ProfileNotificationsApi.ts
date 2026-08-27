import { ApiService } from '@core/api/apiService';

export class ProfileNotificationsApi {
  private static endpoint = '/profile/profile-notifications';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
