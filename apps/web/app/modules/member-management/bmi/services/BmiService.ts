import { BmiApi } from '../api';

export class BmiService {
  static async getList() {
    return BmiApi.getAll();
  }
}
