import { EquipmentListApi } from '../api';

export class EquipmentListService {
  static async getList() {
    return EquipmentListApi.getAll();
  }
}
