import { WhatsappApi } from '../api';

export class WhatsappService {
  static async getList() {
    return WhatsappApi.getAll();
  }
}
