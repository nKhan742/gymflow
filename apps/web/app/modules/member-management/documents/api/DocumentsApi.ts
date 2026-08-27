import { ApiService } from '@core/api/apiService';

export class DocumentsApi {
  private static endpoint = '/member-management/documents';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
