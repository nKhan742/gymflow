import { PreferencesService } from '../service/preferences.service.js';

describe('PreferencesService', () => {
  it('should be defined', () => {
    const service = new PreferencesService();
    expect(service).toBeDefined();
  });
});
