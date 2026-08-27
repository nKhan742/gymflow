import { WhatsappService } from '../service/whatsapp.service.js';

describe('WhatsappService', () => {
  it('should be defined', () => {
    const service = new WhatsappService();
    expect(service).toBeDefined();
  });
});
