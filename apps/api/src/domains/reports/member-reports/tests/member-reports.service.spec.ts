import { MemberReportsService } from '../service/member-reports.service.js';

describe('MemberReportsService', () => {
  it('should be defined', () => {
    const service = new MemberReportsService();
    expect(service).toBeDefined();
  });
});
