import { ApiService } from '@core/api/apiService';

export class VisitorsApi {
  private static endpoint = '/crm/visitors';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
