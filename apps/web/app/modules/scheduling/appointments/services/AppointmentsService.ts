import { AppointmentsApi } from '../api';

export class AppointmentsService {
  static async getList() {
    return AppointmentsApi.getAll();
  }
}
