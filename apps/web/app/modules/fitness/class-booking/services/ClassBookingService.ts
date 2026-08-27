import { ClassBookingApi } from '../api';

export class ClassBookingService {
  static async getList() {
    return ClassBookingApi.getAll();
  }
}
