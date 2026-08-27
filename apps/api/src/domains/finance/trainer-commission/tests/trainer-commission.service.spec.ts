import { TrainerCommissionService } from '../service/trainer-commission.service.js';

describe('TrainerCommissionService', () => {
  it('should be defined', () => {
    const service = new TrainerCommissionService();
    expect(service).toBeDefined();
  });
});
