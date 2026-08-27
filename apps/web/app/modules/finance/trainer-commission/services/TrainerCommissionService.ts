import { TrainerCommissionApi } from '../api';

export class TrainerCommissionService {
  static async getList() {
    return TrainerCommissionApi.getAll();
  }
}
