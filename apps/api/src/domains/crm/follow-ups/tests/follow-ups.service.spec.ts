import { FollowUpsService } from '../service/follow-ups.service.js';

describe('FollowUpsService', () => {
  it('should be defined', () => {
    const service = new FollowUpsService();
    expect(service).toBeDefined();
  });
});
