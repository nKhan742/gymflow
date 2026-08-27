import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IReferralsModel, ReferralsModel } from '../model/referrals.model.js';

export interface IReferralsRepository extends IBaseRepository<IReferralsModel> {}

export class ReferralsRepository extends BaseRepository<IReferralsModel> implements IReferralsRepository {
  constructor() {
    super(ReferralsModel);
  }
}
