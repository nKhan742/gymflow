import { ProfileNotificationsApi } from '../api';

export class ProfileNotificationsService {
  static async getList() {
    return ProfileNotificationsApi.getAll();
  }
}
