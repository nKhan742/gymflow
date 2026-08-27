import { ApiService } from '@core/api/apiService';

export class AttendanceApi {
  private static endpoint = '/member-management/attendance';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
