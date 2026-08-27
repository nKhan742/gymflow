import { ActivityLogsService } from '../service/activity-logs.service.js';

describe('ActivityLogsService', () => {
  it('should be defined', () => {
    const service = new ActivityLogsService();
    expect(service).toBeDefined();
  });
});
