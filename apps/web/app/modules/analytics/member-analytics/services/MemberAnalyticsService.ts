import { MemberAnalyticsApi } from '../api';

export class MemberAnalyticsService {
  static async getList() {
    return MemberAnalyticsApi.getAll();
  }
}
