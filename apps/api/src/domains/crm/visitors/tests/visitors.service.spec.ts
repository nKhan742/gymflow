import { VisitorsService } from '../service/visitors.service.js';

describe('VisitorsService', () => {
  it('should be defined', () => {
    const service = new VisitorsService();
    expect(service).toBeDefined();
  });
});
