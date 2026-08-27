import { ApiService } from '@core/api/apiService';

export class AuditLogsApi {
  private static endpoint = '/administration/audit-logs';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
