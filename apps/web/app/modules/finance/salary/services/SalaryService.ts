import { SalaryApi } from '../api';

export class SalaryService {
  static async getList() {
    return SalaryApi.getAll();
  }
}
