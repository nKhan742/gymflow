import { ApiService } from '@core/api/apiService';

export class WalletApi {
  private static endpoint = '/finance/wallet';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
