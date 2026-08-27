import { ReferralsService } from '../service/referrals.service.js';

describe('ReferralsService', () => {
  it('should be defined', () => {
    const service = new ReferralsService();
    expect(service).toBeDefined();
  });
});
