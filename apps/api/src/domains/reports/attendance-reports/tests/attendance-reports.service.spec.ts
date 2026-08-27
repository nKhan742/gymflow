import { AttendanceReportsService } from '../service/attendance-reports.service.js';

describe('AttendanceReportsService', () => {
  it('should be defined', () => {
    const service = new AttendanceReportsService();
    expect(service).toBeDefined();
  });
});
