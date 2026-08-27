import { ApiService } from '@core/api/apiService';

export class TransformationApi {
  private static endpoint = '/member-management/transformation';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
