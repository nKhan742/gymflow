import { WorkingHoursApi } from '../api';

export class WorkingHoursService {
  static async getList() {
    return WorkingHoursApi.getAll();
  }
}
