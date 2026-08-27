import { ApiService } from '@core/api/apiService';

export class VerifyOtpApi {
  private static endpoint = '/auth/verify-otp';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
