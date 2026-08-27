import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IMembershipPlansModel, MembershipPlansModel } from '../model/membership-plans.model.js';

export interface IMembershipPlansRepository extends IBaseRepository<IMembershipPlansModel> {}

export class MembershipPlansRepository extends BaseRepository<IMembershipPlansModel> implements IMembershipPlansRepository {
  constructor() {
    super(MembershipPlansModel);
  }
}
