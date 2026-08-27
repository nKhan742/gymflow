import { MembershipRenewalsApi } from '../api';

export class MembershipRenewalsService {
  static async getList() {
    return MembershipRenewalsApi.getAll();
  }
}
