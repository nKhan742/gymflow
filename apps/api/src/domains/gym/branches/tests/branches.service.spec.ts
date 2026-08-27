import { BranchesService } from '../service/branches.service.js';

describe('BranchesService', () => {
  it('should be defined', () => {
    const service = new BranchesService();
    expect(service).toBeDefined();
  });
});
