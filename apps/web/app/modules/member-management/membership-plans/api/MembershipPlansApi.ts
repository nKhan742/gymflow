import { ApiService } from '@core/api/apiService';

export class MembershipPlansApi {
  private static endpoint = '/member-management/membership-plans';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
