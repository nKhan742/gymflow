import { ApiService } from '@core/api/apiService';

export class AnnouncementsApi {
  private static endpoint = '/communication/announcements';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
