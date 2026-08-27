import { ApiService } from '@core/api/apiService';

export class RolesApi {
  private static endpoint = '/administration/roles';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
