import { MembershipReportsApi } from '../api';

export class MembershipReportsService {
  static async getList() {
    return MembershipReportsApi.getAll();
  }
}
