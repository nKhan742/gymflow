import { ApiService } from '@core/api/apiService';

export class TasksApi {
  private static endpoint = '/crm/tasks';

  static async getAll() {
    return ApiService.get(this.endpoint);
  }
}
