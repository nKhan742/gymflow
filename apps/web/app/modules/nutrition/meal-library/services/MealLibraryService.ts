import { MealLibraryApi } from '../api';

export class MealLibraryService {
  static async getList() {
    return MealLibraryApi.getAll();
  }
}
