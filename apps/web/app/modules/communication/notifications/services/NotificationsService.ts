import { NotificationsApi } from '../api';

export class NotificationsService {
  static async getList() {
    return NotificationsApi.getAll();
  }
}
