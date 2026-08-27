import { TrainerAnalyticsService } from '../service/trainer-analytics.service.js';

describe('TrainerAnalyticsService', () => {
  it('should be defined', () => {
    const service = new TrainerAnalyticsService();
    expect(service).toBeDefined();
  });
});
