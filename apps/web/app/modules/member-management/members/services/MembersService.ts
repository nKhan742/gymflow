import { MembersApi } from '../api';

export class MembersService {
  static async getList() {
    return MembersApi.getAll();
  }
}
