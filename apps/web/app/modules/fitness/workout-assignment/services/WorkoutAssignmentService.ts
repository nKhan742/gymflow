import { WorkoutAssignmentApi } from '../api';

export class WorkoutAssignmentService {
  static async getList() {
    return WorkoutAssignmentApi.getAll();
  }
}
