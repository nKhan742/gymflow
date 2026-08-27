import { DepartmentsApi } from '../api';

export class DepartmentsService {
  static async getList() {
    return DepartmentsApi.getAll();
  }
}
