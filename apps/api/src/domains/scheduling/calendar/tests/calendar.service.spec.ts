import { CalendarService } from '../service/calendar.service.js';

describe('CalendarService', () => {
  it('should be defined', () => {
    const service = new CalendarService();
    expect(service).toBeDefined();
  });
});
