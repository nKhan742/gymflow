import { GymProfileService } from '../service/gym-profile.service.js';

describe('GymProfileService', () => {
  it('should be defined', () => {
    const service = new GymProfileService();
    expect(service).toBeDefined();
  });
});
