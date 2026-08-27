import { AppointmentsService } from '../service/appointments.service.js';

describe('AppointmentsService', () => {
  it('should be defined', () => {
    const service = new AppointmentsService();
    expect(service).toBeDefined();
  });
});
