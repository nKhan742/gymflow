import { ResourceBookingService } from '../service/resource-booking.service.js';

describe('ResourceBookingService', () => {
  it('should be defined', () => {
    const service = new ResourceBookingService();
    expect(service).toBeDefined();
  });
});
