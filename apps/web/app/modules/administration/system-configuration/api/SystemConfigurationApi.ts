import { ApiService } from '@core/api/apiService';

export class SystemConfigurationApi {
  private static endpoint = '/administration/system-configuration';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
