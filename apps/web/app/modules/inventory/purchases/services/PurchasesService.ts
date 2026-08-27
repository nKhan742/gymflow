import { PurchasesApi } from '../api';

export class PurchasesService {
  static async getList() {
    return PurchasesApi.getAll();
  }
}
