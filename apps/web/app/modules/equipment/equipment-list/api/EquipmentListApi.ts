import { ApiService } from '@core/api/apiService';

export class EquipmentListApi {
  private static endpoint = '/equipment/equipment-list';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
