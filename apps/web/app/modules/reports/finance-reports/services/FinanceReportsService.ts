import { FinanceReportsApi } from '../api';

export class FinanceReportsService {
  static async getList() {
    return FinanceReportsApi.getAll();
  }
}
