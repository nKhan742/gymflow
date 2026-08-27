import { TrainerReportsApi } from '../api';

export class TrainerReportsService {
  static async getList() {
    return TrainerReportsApi.getAll();
  }
}
