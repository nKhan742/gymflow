import { FollowUpsApi } from '../api';

export class FollowUpsService {
  static async getList() {
    return FollowUpsApi.getAll();
  }
}
