import { ApiService } from '@core/api/apiService';

export class SettingsApi {
  private static endpoint = '/administration/settings';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
