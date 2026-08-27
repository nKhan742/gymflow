import { WaterIntakeApi } from '../api';

export class WaterIntakeService {
  static async getList() {
    return WaterIntakeApi.getAll();
  }
}
