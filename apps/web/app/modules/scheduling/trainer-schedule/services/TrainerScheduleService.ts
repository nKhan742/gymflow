import { TrainerScheduleApi } from '../api';

export class TrainerScheduleService {
  static async getList() {
    return TrainerScheduleApi.getAll();
  }
}
