import { EmergencyContactsService } from '../service/emergency-contacts.service.js';

describe('EmergencyContactsService', () => {
  it('should be defined', () => {
    const service = new EmergencyContactsService();
    expect(service).toBeDefined();
  });
});
