import { PermissionsService } from '../service/permissions.service.js';

describe('PermissionsService', () => {
  it('should be defined', () => {
    const service = new PermissionsService();
    expect(service).toBeDefined();
  });
});
