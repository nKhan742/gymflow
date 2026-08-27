import { ApiService } from '@core/api/apiService';

export class SmsApi {
  private static endpoint = '/communication/sms';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
