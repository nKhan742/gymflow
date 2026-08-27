import { TrainerAnalyticsApi } from '../api';

export class TrainerAnalyticsService {
  static async getList() {
    return TrainerAnalyticsApi.getAll();
  }
}
