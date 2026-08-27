import { DietPlansService } from '../service/diet-plans.service.js';

describe('DietPlansService', () => {
  it('should be defined', () => {
    const service = new DietPlansService();
    expect(service).toBeDefined();
  });
});
