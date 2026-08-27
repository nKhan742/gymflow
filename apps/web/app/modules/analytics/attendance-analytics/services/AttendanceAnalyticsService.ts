import { AttendanceAnalyticsApi } from '../api';

export class AttendanceAnalyticsService {
  static async getList() {
    return AttendanceAnalyticsApi.getAll();
  }
}
