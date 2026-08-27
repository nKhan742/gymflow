import { ApiService } from '@core/api/apiService';

export class ChangePasswordApi {
  private static endpoint = '/auth/change-password';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
