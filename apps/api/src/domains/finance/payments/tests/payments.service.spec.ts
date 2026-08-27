import { PaymentsService } from '../service/payments.service.js';

describe('PaymentsService', () => {
  it('should be defined', () => {
    const service = new PaymentsService();
    expect(service).toBeDefined();
  });
});
