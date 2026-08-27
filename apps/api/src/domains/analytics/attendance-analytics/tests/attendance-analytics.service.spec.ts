import { AttendanceAnalyticsService } from '../service/attendance-analytics.service.js';

describe('AttendanceAnalyticsService', () => {
  it('should be defined', () => {
    const service = new AttendanceAnalyticsService();
    expect(service).toBeDefined();
  });
});
