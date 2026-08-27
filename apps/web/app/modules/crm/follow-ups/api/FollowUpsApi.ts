import { ApiService } from '@core/api/apiService';

export class FollowUpsApi {
  private static endpoint = '/crm/follow-ups';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
