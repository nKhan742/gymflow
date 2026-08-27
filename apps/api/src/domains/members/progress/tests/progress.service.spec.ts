import { ProgressService } from '../service/progress.service.js';

describe('ProgressService', () => {
  it('should be defined', () => {
    const service = new ProgressService();
    expect(service).toBeDefined();
  });
});
