import { ApiService } from '@core/api/apiService';

export class ForgotPasswordApi {
  private static endpoint = '/auth/forgot-password';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
