import { DiscountsApi } from '../api';

export class DiscountsService {
  static async getList() {
    return DiscountsApi.getAll();
  }
}
