import { ApiService } from '@core/api/apiService';

export class LoginApi {
  private static endpoint = '/auth/login';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
