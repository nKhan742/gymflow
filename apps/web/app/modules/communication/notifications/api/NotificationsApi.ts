import { ApiService } from '@core/api/apiService';

export class NotificationsApi {
  private static endpoint = '/communication/notifications';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
