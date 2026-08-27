import { CampaignsService } from '../service/campaigns.service.js';

describe('CampaignsService', () => {
  it('should be defined', () => {
    const service = new CampaignsService();
    expect(service).toBeDefined();
  });
});
