import { TrialMembersService } from '../service/trial-members.service.js';

describe('TrialMembersService', () => {
  it('should be defined', () => {
    const service = new TrialMembersService();
    expect(service).toBeDefined();
  });
});
