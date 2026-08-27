import { MedicalHistoryApi } from '../api';

export class MedicalHistoryService {
  static async getList() {
    return MedicalHistoryApi.getAll();
  }
}
