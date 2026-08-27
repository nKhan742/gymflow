import { SettingsService } from '../service/settings.service.js';

describe('SettingsService', () => {
  it('should be defined', () => {
    const service = new SettingsService();
    expect(service).toBeDefined();
  });
});
