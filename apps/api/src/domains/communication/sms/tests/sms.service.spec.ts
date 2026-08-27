import { SmsService } from '../service/sms.service.js';

describe('SmsService', () => {
  it('should be defined', () => {
    const service = new SmsService();
    expect(service).toBeDefined();
  });
});
