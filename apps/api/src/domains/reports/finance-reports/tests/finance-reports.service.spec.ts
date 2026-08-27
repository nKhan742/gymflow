import { FinanceReportsService } from '../service/finance-reports.service.js';

describe('FinanceReportsService', () => {
  it('should be defined', () => {
    const service = new FinanceReportsService();
    expect(service).toBeDefined();
  });
});
