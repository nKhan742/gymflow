import { RolesService } from '../service/roles.service.js';

describe('RolesService', () => {
  it('should be defined', () => {
    const service = new RolesService();
    expect(service).toBeDefined();
  });
});
