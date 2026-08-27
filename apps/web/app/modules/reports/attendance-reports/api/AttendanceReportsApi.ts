import { ApiService } from '@core/api/apiService';

export class AttendanceReportsApi {
  private static endpoint = '/reports/attendance-reports';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
