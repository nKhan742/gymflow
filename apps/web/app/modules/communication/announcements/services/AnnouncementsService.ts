import { AnnouncementsApi } from '../api';

export class AnnouncementsService {
  static async getList() {
    return AnnouncementsApi.getAll();
  }
}
