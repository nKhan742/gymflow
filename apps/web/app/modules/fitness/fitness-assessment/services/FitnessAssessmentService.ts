import { FitnessAssessmentApi } from '../api';

export class FitnessAssessmentService {
  static async getList() {
    return FitnessAssessmentApi.getAll();
  }
}
