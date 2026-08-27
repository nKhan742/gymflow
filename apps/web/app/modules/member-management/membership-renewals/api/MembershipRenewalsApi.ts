import { ApiService } from '@core/api/apiService';

export class MembershipRenewalsApi {
  private static endpoint = '/member-management/membership-renewals';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
