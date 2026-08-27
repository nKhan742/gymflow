import { NutritionDashboardApi } from '../api';

export class NutritionDashboardService {
  static async getList() {
    return NutritionDashboardApi.getAll();
  }
}
