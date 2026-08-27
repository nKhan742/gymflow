import { PosService } from '../service/pos.service.js';

describe('PosService', () => {
  it('should be defined', () => {
    const service = new PosService();
    expect(service).toBeDefined();
  });
});
