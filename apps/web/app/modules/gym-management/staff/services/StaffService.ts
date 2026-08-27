import { StaffApi } from '../api';

export class StaffService {
  static async getList() {
    return StaffApi.getAll();
  }
}
