import { InvoicesApi } from '../api';

export class InvoicesService {
  static async getList() {
    return InvoicesApi.getAll();
  }
}
