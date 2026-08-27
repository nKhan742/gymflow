import { WaterIntakeService } from '../service/water-intake.service.js';

describe('WaterIntakeService', () => {
  it('should be defined', () => {
    const service = new WaterIntakeService();
    expect(service).toBeDefined();
  });
});
