import { ApiService } from '@core/api/apiService';

export class MembersApi {
  private static endpoint = '/member-management/members';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
