import { VisitorsApi } from '../api';

export class VisitorsService {
  static async getList() {
    return VisitorsApi.getAll();
  }
}
