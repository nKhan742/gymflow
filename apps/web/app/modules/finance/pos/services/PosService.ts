import { PosApi } from '../api';

export class PosService {
  static async getList() {
    return PosApi.getAll();
  }
}
