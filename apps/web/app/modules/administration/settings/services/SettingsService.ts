import { SettingsApi } from '../api';

export class SettingsService {
  static async getList() {
    return SettingsApi.getAll();
  }
}
