import { LeadsApi } from '../api';

export class LeadsService {
  static async getList() {
    return LeadsApi.getAll();
  }
}
