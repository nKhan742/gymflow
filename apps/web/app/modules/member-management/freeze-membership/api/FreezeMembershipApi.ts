import { ApiService } from '@core/api/apiService';

export class FreezeMembershipApi {
  private static endpoint = '/member-management/freeze-membership';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
