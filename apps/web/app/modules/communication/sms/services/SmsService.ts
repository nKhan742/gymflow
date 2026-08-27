import { SmsApi } from '../api';

export class SmsService {
  static async getList() {
    return SmsApi.getAll();
  }
}
