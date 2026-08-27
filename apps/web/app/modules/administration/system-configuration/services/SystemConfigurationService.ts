import { SystemConfigurationApi } from '../api';

export class SystemConfigurationService {
  static async getList() {
    return SystemConfigurationApi.getAll();
  }
}
