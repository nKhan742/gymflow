import { ProfileChangePasswordApi } from '../api';

export class ProfileChangePasswordService {
  static async getList() {
    return ProfileChangePasswordApi.getAll();
  }
}
