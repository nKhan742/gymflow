import { PermissionsApi } from '../api';

export class PermissionsService {
  static async getList() {
    return PermissionsApi.getAll();
  }
}
