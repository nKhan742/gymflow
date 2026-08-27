import { BodyMeasurementsApi } from '../api';

export class BodyMeasurementsService {
  static async getList() {
    return BodyMeasurementsApi.getAll();
  }
}
