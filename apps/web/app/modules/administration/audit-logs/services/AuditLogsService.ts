import { AuditLogsApi } from '../api';

export class AuditLogsService {
  static async getList() {
    return AuditLogsApi.getAll();
  }
}
