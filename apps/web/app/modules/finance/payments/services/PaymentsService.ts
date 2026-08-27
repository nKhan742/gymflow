import { PaymentsApi } from '../api';

export class PaymentsService {
  static async getList() {
    return PaymentsApi.getAll();
  }
}
