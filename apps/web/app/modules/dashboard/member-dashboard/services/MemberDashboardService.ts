import { MemberDashboardApi } from '../api';

export class MemberDashboardService {
  static async getList() {
    return MemberDashboardApi.getAll();
  }
}
