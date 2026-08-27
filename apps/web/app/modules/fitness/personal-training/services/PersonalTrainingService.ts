import { PersonalTrainingApi } from '../api';

export class PersonalTrainingService {
  static async getList() {
    return PersonalTrainingApi.getAll();
  }
}
