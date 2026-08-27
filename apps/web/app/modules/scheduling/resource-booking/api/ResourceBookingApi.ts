import { ApiService } from '@core/api/apiService';

export class ResourceBookingApi {
  private static endpoint = '/scheduling/resource-booking';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
