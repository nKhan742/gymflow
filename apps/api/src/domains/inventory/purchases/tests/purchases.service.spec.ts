import { PurchasesService } from '../service/purchases.service.js';

describe('PurchasesService', () => {
  it('should be defined', () => {
    const service = new PurchasesService();
    expect(service).toBeDefined();
  });
});
