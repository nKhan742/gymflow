import { ProductsApi } from '../api';

export class ProductsService {
  static async getList() {
    return ProductsApi.getAll();
  }
}
