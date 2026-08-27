import { ApiService } from '@core/api/apiService';

export class ReferralsApi {
  private static endpoint = '/crm/referrals';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
