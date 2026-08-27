import { ApiService } from '@core/api/apiService';

export class TrainerScheduleApi {
  private static endpoint = '/scheduling/trainer-schedule';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
