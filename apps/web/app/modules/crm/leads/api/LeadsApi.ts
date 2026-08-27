import { ApiService } from '@core/api/apiService';

export class LeadsApi {
  private static endpoint = '/crm/leads';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
