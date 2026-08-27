import { ExerciseCategoriesApi } from '../api';

export class ExerciseCategoriesService {
  static async getList() {
    return ExerciseCategoriesApi.getAll();
  }
}
