import { DiscountsService } from '../service/discounts.service.js';

describe('DiscountsService', () => {
  it('should be defined', () => {
    const service = new DiscountsService();
    expect(service).toBeDefined();
  });
});
