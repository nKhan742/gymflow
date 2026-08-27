import { LeadsService } from '../service/leads.service.js';

describe('LeadsService', () => {
  it('should be defined', () => {
    const service = new LeadsService();
    expect(service).toBeDefined();
  });
});
