import { AdminDashboardApi } from '../api';

export class AdminDashboardService {
  static async getList() {
    return AdminDashboardApi.getAll();
  }
}
