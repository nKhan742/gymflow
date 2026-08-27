import { UsersService } from '../service/users.service.js';

describe('UsersService', () => {
  it('should be defined', () => {
    const service = new UsersService();
    expect(service).toBeDefined();
  });
});
