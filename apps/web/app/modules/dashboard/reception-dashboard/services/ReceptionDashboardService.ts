import { ReceptionDashboardApi } from '../api';

export class ReceptionDashboardService {
  static async getList() {
    return ReceptionDashboardApi.getAll();
  }
}
