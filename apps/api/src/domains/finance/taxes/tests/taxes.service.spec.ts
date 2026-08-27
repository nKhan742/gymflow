import { TaxesService } from '../service/taxes.service.js';

describe('TaxesService', () => {
  it('should be defined', () => {
    const service = new TaxesService();
    expect(service).toBeDefined();
  });
});
