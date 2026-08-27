import { MembershipPlansApi } from '../api';

export class MembershipPlansService {
  static async getList() {
    return MembershipPlansApi.getAll();
  }
}
