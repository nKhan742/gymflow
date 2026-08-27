import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ICampaignsModel, CampaignsModel } from '../model/campaigns.model.js';

export interface ICampaignsRepository extends IBaseRepository<ICampaignsModel> {}

export class CampaignsRepository extends BaseRepository<ICampaignsModel> implements ICampaignsRepository {
  constructor() {
    super(CampaignsModel);
  }
}
