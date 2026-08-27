import { ApiService } from '@core/api/apiService';

export class PermissionsApi {
  private static endpoint = '/administration/permissions';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
