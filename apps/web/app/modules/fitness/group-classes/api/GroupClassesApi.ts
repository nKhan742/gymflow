import { ApiService } from '@core/api/apiService';

export class GroupClassesApi {
  private static endpoint = '/fitness/group-classes';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
