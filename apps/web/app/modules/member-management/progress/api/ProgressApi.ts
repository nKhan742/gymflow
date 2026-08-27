import { ApiService } from '@core/api/apiService';

export class ProgressApi {
  private static endpoint = '/member-management/progress';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
