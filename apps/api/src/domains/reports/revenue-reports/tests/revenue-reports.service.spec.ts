import { RevenueReportsService } from '../service/revenue-reports.service.js';

describe('RevenueReportsService', () => {
  it('should be defined', () => {
    const service = new RevenueReportsService();
    expect(service).toBeDefined();
  });
});
