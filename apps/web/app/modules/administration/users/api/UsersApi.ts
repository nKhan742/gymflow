import { ApiService } from '@core/api/apiService';

export class UsersApi {
  private static endpoint = '/administration/users';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
