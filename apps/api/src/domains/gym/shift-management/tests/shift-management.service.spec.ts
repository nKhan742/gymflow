import { ShiftManagementService } from '../service/shift-management.service.js';

describe('ShiftManagementService', () => {
  it('should be defined', () => {
    const service = new ShiftManagementService();
    expect(service).toBeDefined();
  });
});
