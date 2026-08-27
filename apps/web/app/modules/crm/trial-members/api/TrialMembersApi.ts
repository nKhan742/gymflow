import { ApiService } from '@core/api/apiService';

export class TrialMembersApi {
  private static endpoint = '/crm/trial-members';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
