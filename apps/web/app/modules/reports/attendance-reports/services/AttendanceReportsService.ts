import { AttendanceReportsApi } from '../api';

export class AttendanceReportsService {
  static async getList() {
    return AttendanceReportsApi.getAll();
  }
}
