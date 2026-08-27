import { ShiftManagementApi } from '../api';

export class ShiftManagementService {
  static async getList() {
    return ShiftManagementApi.getAll();
  }
}
