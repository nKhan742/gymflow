import { MembersService } from '../service/members.service.js';

describe('MembersService', () => {
  it('should be defined', () => {
    const service = new MembersService();
    expect(service).toBeDefined();
  });
});
