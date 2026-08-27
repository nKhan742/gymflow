import { MaintenanceService } from '../service/maintenance.service.js';

describe('MaintenanceService', () => {
  it('should be defined', () => {
    const service = new MaintenanceService();
    expect(service).toBeDefined();
  });
});
