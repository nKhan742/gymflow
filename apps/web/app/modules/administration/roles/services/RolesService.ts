import { RolesApi } from '../api';

export class RolesService {
  static async getList() {
    return RolesApi.getAll();
  }
}
