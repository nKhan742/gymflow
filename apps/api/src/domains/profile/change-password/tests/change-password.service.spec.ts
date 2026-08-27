import { ChangePasswordService } from '../service/change-password.service.js';

describe('ChangePasswordService', () => {
  it('should be defined', () => {
    const service = new ChangePasswordService();
    expect(service).toBeDefined();
  });
});
