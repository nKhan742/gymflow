import { ProgressApi } from '../api';

export class ProgressService {
  static async getList() {
    return ProgressApi.getAll();
  }
}
