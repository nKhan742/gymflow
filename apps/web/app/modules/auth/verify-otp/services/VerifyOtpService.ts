import { VerifyOtpApi } from '../api';

export class VerifyOtpService {
  static async getList() {
    return VerifyOtpApi.getAll();
  }
}
