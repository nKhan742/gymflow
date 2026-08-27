import { StaffService } from '../service/staff.service.js';

describe('StaffService', () => {
  it('should be defined', () => {
    const service = new StaffService();
    expect(service).toBeDefined();
  });
});
