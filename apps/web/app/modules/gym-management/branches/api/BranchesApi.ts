import { ApiService } from '@core/api/apiService';

export class BranchesApi {
  private static endpoint = '/gym-management/branches';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
