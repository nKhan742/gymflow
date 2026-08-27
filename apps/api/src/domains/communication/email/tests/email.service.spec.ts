import { EmailService } from '../service/email.service.js';

describe('EmailService', () => {
  it('should be defined', () => {
    const service = new EmailService();
    expect(service).toBeDefined();
  });
});
