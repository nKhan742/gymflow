import { AccountantDashboardApi } from '../api';

export class AccountantDashboardService {
  static async getList() {
    return AccountantDashboardApi.getAll();
  }
}
