import { AuditLogsService } from '../service/audit-logs.service.js';

describe('AuditLogsService', () => {
  it('should be defined', () => {
    const service = new AuditLogsService();
    expect(service).toBeDefined();
  });
});
