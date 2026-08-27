import { ServiceHistoryService } from '../service/service-history.service.js';

describe('ServiceHistoryService', () => {
  it('should be defined', () => {
    const service = new ServiceHistoryService();
    expect(service).toBeDefined();
  });
});
