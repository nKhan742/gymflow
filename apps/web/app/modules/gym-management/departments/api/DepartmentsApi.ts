import { ApiService } from '@core/api/apiService';

export class DepartmentsApi {
  private static endpoint = '/gym-management/departments';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
