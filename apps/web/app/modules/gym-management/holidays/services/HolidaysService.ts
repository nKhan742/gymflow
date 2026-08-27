import { HolidaysApi } from '../api';

export class HolidaysService {
  static async getList() {
    return HolidaysApi.getAll();
  }
}
