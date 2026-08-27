import { WalletApi } from '../api';

export class WalletService {
  static async getList() {
    return WalletApi.getAll();
  }
}
