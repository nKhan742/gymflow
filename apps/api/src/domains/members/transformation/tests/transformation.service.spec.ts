import { TransformationService } from '../service/transformation.service.js';

describe('TransformationService', () => {
  it('should be defined', () => {
    const service = new TransformationService();
    expect(service).toBeDefined();
  });
});
