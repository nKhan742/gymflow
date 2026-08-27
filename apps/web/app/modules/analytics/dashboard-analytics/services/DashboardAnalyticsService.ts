import { DashboardAnalyticsApi } from '../api';

export class DashboardAnalyticsService {
  static async getList() {
    return DashboardAnalyticsApi.getAll();
  }
}
