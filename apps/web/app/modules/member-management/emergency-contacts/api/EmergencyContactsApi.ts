import { ApiService } from '@core/api/apiService';

export class EmergencyContactsApi {
  private static endpoint = '/member-management/emergency-contacts';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
