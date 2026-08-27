import { RevenueAnalyticsApi } from '../api';

export class RevenueAnalyticsService {
  static async getList() {
    return RevenueAnalyticsApi.getAll();
  }
}
