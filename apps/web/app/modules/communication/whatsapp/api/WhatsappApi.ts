import { ApiService } from '@core/api/apiService';

export class WhatsappApi {
  private static endpoint = '/communication/whatsapp';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
