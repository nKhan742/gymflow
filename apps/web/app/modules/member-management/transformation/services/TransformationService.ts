import { TransformationApi } from '../api';

export class TransformationService {
  static async getList() {
    return TransformationApi.getAll();
  }
}
