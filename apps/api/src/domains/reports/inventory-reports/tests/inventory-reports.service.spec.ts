import { InventoryReportsService } from '../service/inventory-reports.service.js';

describe('InventoryReportsService', () => {
  it('should be defined', () => {
    const service = new InventoryReportsService();
    expect(service).toBeDefined();
  });
});
