import { AttendanceService } from '../service/attendance.service.js';

describe('AttendanceService', () => {
  it('should be defined', () => {
    const service = new AttendanceService();
    expect(service).toBeDefined();
  });
});
