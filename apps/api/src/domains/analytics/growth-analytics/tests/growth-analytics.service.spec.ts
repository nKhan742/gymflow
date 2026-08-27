import { GrowthAnalyticsService } from '../service/growth-analytics.service.js';

describe('GrowthAnalyticsService', () => {
  it('should be defined', () => {
    const service = new GrowthAnalyticsService();
    expect(service).toBeDefined();
  });
});
