import { SalaryService } from '../service/salary.service.js';

describe('SalaryService', () => {
  it('should be defined', () => {
    const service = new SalaryService();
    expect(service).toBeDefined();
  });
});
