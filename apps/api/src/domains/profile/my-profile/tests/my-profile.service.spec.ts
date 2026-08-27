import { MyProfileService } from '../service/my-profile.service.js';

describe('MyProfileService', () => {
  it('should be defined', () => {
    const service = new MyProfileService();
    expect(service).toBeDefined();
  });
});
