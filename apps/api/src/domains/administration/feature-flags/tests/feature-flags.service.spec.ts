import { FeatureFlagsService } from '../service/feature-flags.service.js';

describe('FeatureFlagsService', () => {
  it('should be defined', () => {
    const service = new FeatureFlagsService();
    expect(service).toBeDefined();
  });
});
