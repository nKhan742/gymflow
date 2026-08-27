import { WorkoutPlansApi } from '../api';

export class WorkoutPlansService {
  static async getList() {
    return WorkoutPlansApi.getAll();
  }
}
