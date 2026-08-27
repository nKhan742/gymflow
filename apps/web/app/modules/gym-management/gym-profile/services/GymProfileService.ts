import { GymProfileApi } from '../api';

export class GymProfileService {
  static async getList() {
    return GymProfileApi.getAll();
  }
}
