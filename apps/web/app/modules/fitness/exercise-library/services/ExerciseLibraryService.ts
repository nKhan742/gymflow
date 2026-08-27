import { ExerciseLibraryApi } from '../api';

export class ExerciseLibraryService {
  static async getList() {
    return ExerciseLibraryApi.getAll();
  }
}
