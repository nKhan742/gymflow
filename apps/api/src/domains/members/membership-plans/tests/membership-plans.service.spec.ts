import { MembershipPlansService } from '../service/membership-plans.service.js';

describe('MembershipPlansService', () => {
  it('should be defined', () => {
    const service = new MembershipPlansService();
    expect(service).toBeDefined();
  });
});
