import { ResetPasswordApi } from '../api';

export class ResetPasswordService {
  static async getList() {
    return ResetPasswordApi.getAll();
  }
}
