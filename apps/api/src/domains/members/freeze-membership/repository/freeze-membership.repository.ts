import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IFreezeMembershipModel, FreezeMembershipModel } from '../model/freeze-membership.model.js';

export interface IFreezeMembershipRepository extends IBaseRepository<IFreezeMembershipModel> {}

export class FreezeMembershipRepository extends BaseRepository<IFreezeMembershipModel> implements IFreezeMembershipRepository {
  constructor() {
    super(FreezeMembershipModel);
  }
}
