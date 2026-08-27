import { ProfilePreferencesApi } from '../api';

export class ProfilePreferencesService {
  static async getList() {
    return ProfilePreferencesApi.getAll();
  }
}
