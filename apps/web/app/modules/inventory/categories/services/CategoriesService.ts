import { CategoriesApi } from '../api';

export class CategoriesService {
  static async getList() {
    return CategoriesApi.getAll();
  }
}
