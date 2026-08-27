import { ForgotPasswordApi } from '../api';

export class ForgotPasswordService {
  static async getList() {
    return ForgotPasswordApi.getAll();
  }
}
