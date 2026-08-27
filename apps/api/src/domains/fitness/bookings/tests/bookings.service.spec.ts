import { BookingsService } from '../service/bookings.service.js';

describe('BookingsService', () => {
  it('should be defined', () => {
    const service = new BookingsService();
    expect(service).toBeDefined();
  });
});
