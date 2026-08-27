import { TrialMembersApi } from '../api';

export class TrialMembersService {
  static async getList() {
    return TrialMembersApi.getAll();
  }
}
