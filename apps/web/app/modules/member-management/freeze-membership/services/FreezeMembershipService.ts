import { FreezeMembershipApi } from '../api';

export class FreezeMembershipService {
  static async getList() {
    return FreezeMembershipApi.getAll();
  }
}
