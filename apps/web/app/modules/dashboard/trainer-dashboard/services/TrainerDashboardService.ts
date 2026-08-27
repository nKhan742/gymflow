import { TrainerDashboardApi } from '../api';

export class TrainerDashboardService {
  static async getList() {
    return TrainerDashboardApi.getAll();
  }
}
