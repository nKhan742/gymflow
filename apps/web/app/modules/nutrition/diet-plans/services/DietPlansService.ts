import { DietPlansApi } from '../api';

export class DietPlansService {
  static async getList() {
    return DietPlansApi.getAll();
  }
}
