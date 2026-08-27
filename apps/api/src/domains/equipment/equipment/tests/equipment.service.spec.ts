import { EquipmentService } from '../service/equipment.service.js';

describe('EquipmentService', () => {
  it('should be defined', () => {
    const service = new EquipmentService();
    expect(service).toBeDefined();
  });
});
