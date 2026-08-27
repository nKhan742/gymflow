import { ApiService } from '@core/api/apiService';

export class StaffApi {
  private static endpoint = '/gym-management/staff';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
