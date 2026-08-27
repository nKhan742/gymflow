import { ProductsService } from '../service/products.service.js';

describe('ProductsService', () => {
  it('should be defined', () => {
    const service = new ProductsService();
    expect(service).toBeDefined();
  });
});
