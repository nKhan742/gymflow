import { MedicalHistoryService } from '../service/medical-history.service.js';

describe('MedicalHistoryService', () => {
  it('should be defined', () => {
    const service = new MedicalHistoryService();
    expect(service).toBeDefined();
  });
});
