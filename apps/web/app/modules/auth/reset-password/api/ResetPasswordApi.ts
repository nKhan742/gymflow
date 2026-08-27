import { ApiService } from '@core/api/apiService';

export class ResetPasswordApi {
  private static endpoint = '/auth/reset-password';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
