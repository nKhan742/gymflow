import { InvoicesService } from '../service/invoices.service.js';

describe('InvoicesService', () => {
  it('should be defined', () => {
    const service = new InvoicesService();
    expect(service).toBeDefined();
  });
});
