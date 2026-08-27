import { NotificationsService } from '../service/notifications.service.js';

describe('NotificationsService', () => {
  it('should be defined', () => {
    const service = new NotificationsService();
    expect(service).toBeDefined();
  });
});
