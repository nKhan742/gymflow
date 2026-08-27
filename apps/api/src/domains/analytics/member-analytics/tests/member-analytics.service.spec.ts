import { MemberAnalyticsService } from '../service/member-analytics.service.js';

describe('MemberAnalyticsService', () => {
  it('should be defined', () => {
    const service = new MemberAnalyticsService();
    expect(service).toBeDefined();
  });
});
