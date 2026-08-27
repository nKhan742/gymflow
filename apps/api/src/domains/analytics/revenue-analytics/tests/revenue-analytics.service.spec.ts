import { RevenueAnalyticsService } from '../service/revenue-analytics.service.js';

describe('RevenueAnalyticsService', () => {
  it('should be defined', () => {
    const service = new RevenueAnalyticsService();
    expect(service).toBeDefined();
  });
});
