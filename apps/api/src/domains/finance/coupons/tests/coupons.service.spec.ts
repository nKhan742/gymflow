import { CouponsService } from '../service/coupons.service.js';

describe('CouponsService', () => {
  it('should be defined', () => {
    const service = new CouponsService();
    expect(service).toBeDefined();
  });
});
