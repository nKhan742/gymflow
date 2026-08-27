import { ActivityLogsApi } from '../api';

export class ActivityLogsService {
  static async getList() {
    return ActivityLogsApi.getAll();
  }
}
