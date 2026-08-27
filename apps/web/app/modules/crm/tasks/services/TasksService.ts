import { TasksApi } from '../api';

export class TasksService {
  static async getList() {
    return TasksApi.getAll();
  }
}
