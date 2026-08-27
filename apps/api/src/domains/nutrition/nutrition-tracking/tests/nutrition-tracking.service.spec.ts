import { NutritionTrackingService } from '../service/nutrition-tracking.service.js';

describe('NutritionTrackingService', () => {
  it('should be defined', () => {
    const service = new NutritionTrackingService();
    expect(service).toBeDefined();
  });
});
