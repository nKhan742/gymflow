import { ApiService } from '@core/api/apiService';

export class EmailApi {
  private static endpoint = '/communication/email';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
