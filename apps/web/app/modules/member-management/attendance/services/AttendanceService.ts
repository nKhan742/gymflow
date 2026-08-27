import { AttendanceApi } from '../api';

export class AttendanceService {
  static async getList() {
    return AttendanceApi.getAll();
  }
}
