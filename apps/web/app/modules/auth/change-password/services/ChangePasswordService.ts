import { ChangePasswordApi } from '../api';

export class ChangePasswordService {
  static async getList() {
    return ChangePasswordApi.getAll();
  }
}
