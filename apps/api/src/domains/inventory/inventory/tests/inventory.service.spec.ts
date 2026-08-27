import { InventoryService } from '../service/inventory.service.js';

describe('InventoryService', () => {
  it('should be defined', () => {
    const service = new InventoryService();
    expect(service).toBeDefined();
  });
});
