import { EmergencyContactsApi } from '../api';

export class EmergencyContactsService {
  static async getList() {
    return EmergencyContactsApi.getAll();
  }
}
