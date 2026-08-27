import { UsersApi } from '../api';

export class UsersService {
  static async getList() {
    return UsersApi.getAll();
  }
}
