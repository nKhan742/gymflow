import { NutritionTrackingApi } from '../api';

export class NutritionTrackingService {
  static async getList() {
    return NutritionTrackingApi.getAll();
  }
}
