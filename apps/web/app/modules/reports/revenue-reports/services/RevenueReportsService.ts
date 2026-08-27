import { RevenueReportsApi } from '../api';

export class RevenueReportsService {
  static async getList() {
    return RevenueReportsApi.getAll();
  }
}
