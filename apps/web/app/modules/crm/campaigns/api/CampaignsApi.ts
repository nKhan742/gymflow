import { ApiService } from '@core/api/apiService';

export class CampaignsApi {
  private static endpoint = '/crm/campaigns';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
