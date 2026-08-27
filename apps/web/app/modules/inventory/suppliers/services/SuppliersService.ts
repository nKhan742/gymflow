import { SuppliersApi } from '../api';

export class SuppliersService {
  static async getList() {
    return SuppliersApi.getAll();
  }
}
