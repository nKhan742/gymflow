import { MaintenanceApi } from '../api';

export class MaintenanceService {
  static async getList() {
    return MaintenanceApi.getAll();
  }
}
