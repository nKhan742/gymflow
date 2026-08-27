import { InventoryStockApi } from '../api';

export class InventoryStockService {
  static async getList() {
    return InventoryStockApi.getAll();
  }
}
