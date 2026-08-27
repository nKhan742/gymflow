import { ApiService } from '@core/api/apiService';

export class MedicalHistoryApi {
  private static endpoint = '/member-management/medical-history';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
