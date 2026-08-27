import { FreezeMembershipService } from '../service/freeze-membership.service.js';

describe('FreezeMembershipService', () => {
  it('should be defined', () => {
    const service = new FreezeMembershipService();
    expect(service).toBeDefined();
  });
});
