import { ApiService } from '@core/api/apiService';

export class ShiftManagementApi {
  private static endpoint = '/gym-management/shift-management';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
