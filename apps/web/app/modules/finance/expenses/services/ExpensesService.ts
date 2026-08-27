import { ExpensesApi } from '../api';

export class ExpensesService {
  static async getList() {
    return ExpensesApi.getAll();
  }
}
