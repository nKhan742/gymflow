import { ApiService } from '@core/api/apiService';

export class BodyMeasurementsApi {
  private static endpoint = '/member-management/body-measurements';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
