import { BranchesApi } from '../api';

export class BranchesService {
  static async getList() {
    return BranchesApi.getAll();
  }
}
