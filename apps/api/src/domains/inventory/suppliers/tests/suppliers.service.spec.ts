import { SuppliersService } from '../service/suppliers.service.js';

describe('SuppliersService', () => {
  it('should be defined', () => {
    const service = new SuppliersService();
    expect(service).toBeDefined();
  });
});
