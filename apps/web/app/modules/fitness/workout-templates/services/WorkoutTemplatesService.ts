import { WorkoutTemplatesApi } from '../api';

export class WorkoutTemplatesService {
  static async getList() {
    return WorkoutTemplatesApi.getAll();
  }
}
