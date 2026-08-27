import { CampaignsApi } from '../api';

export class CampaignsService {
  static async getList() {
    return CampaignsApi.getAll();
  }
}
