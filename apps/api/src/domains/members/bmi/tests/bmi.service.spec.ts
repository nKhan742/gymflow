import { BmiService } from '../service/bmi.service.js';

describe('BmiService', () => {
  it('should be defined', () => {
    const service = new BmiService();
    expect(service).toBeDefined();
  });
});
