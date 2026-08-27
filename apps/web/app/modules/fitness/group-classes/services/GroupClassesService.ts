import { GroupClassesApi } from '../api';

export class GroupClassesService {
  static async getList() {
    return GroupClassesApi.getAll();
  }
}
