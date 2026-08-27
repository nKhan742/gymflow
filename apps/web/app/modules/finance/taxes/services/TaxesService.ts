import { TaxesApi } from '../api';

export class TaxesService {
  static async getList() {
    return TaxesApi.getAll();
  }
}
