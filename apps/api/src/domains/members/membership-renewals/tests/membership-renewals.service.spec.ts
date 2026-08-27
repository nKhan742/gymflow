import { MembershipRenewalsService } from '../service/membership-renewals.service.js';

describe('MembershipRenewalsService', () => {
  it('should be defined', () => {
    const service = new MembershipRenewalsService();
    expect(service).toBeDefined();
  });
});
