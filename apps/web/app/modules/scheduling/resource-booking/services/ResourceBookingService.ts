import { ResourceBookingApi } from '../api';

export class ResourceBookingService {
  static async getList() {
    return ResourceBookingApi.getAll();
  }
}
