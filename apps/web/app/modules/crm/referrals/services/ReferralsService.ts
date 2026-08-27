import { ReferralsApi } from '../api';

export class ReferralsService {
  static async getList() {
    return ReferralsApi.getAll();
  }
}
