import { AnnouncementsService } from '../service/announcements.service.js';

describe('AnnouncementsService', () => {
  it('should be defined', () => {
    const service = new AnnouncementsService();
    expect(service).toBeDefined();
  });
});
