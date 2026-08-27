import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IMembershipRenewalsModel, MembershipRenewalsModel } from '../model/membership-renewals.model.js';

export interface IMembershipRenewalsRepository extends IBaseRepository<IMembershipRenewalsModel> {}

export class MembershipRenewalsRepository extends BaseRepository<IMembershipRenewalsModel> implements IMembershipRenewalsRepository {
  constructor() {
    super(MembershipRenewalsModel);
  }
}
