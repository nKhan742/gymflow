import { InventoryReportsApi } from '../api';

export class InventoryReportsService {
  static async getList() {
    return InventoryReportsApi.getAll();
  }
}
