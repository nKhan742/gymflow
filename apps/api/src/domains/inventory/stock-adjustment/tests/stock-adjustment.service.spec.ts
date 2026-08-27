import { StockAdjustmentService } from '../service/stock-adjustment.service.js';

describe('StockAdjustmentService', () => {
  it('should be defined', () => {
    const service = new StockAdjustmentService();
    expect(service).toBeDefined();
  });
});
