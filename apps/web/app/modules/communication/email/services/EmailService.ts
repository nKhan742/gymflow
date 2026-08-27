import { EmailApi } from '../api';

export class EmailService {
  static async getList() {
    return EmailApi.getAll();
  }
}
