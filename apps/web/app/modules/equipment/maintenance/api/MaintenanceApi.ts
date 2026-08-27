import { ApiService } from '@core/api/apiService';

export class MaintenanceApi {
  private static endpoint = '/equipment/maintenance';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
