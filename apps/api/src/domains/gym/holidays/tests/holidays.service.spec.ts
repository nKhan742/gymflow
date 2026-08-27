import { HolidaysService } from '../service/holidays.service.js';

describe('HolidaysService', () => {
  it('should be defined', () => {
    const service = new HolidaysService();
    expect(service).toBeDefined();
  });
});
