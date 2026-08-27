import { WorkingHoursService } from '../service/working-hours.service.js';

describe('WorkingHoursService', () => {
  it('should be defined', () => {
    const service = new WorkingHoursService();
    expect(service).toBeDefined();
  });
});
