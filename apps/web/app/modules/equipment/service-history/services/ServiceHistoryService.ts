import { ServiceHistoryApi } from '../api';

export class ServiceHistoryService {
  static async getList() {
    return ServiceHistoryApi.getAll();
  }
}
