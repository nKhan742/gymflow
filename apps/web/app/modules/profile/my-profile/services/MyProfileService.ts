import { MyProfileApi } from '../api';

export class MyProfileService {
  static async getList() {
    return MyProfileApi.getAll();
  }
}
