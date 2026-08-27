import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IMemberAnalyticsModel, MemberAnalyticsModel } from '../model/member-analytics.model.js';

export interface IMemberAnalyticsRepository extends IBaseRepository<IMemberAnalyticsModel> {}

export class MemberAnalyticsRepository extends BaseRepository<IMemberAnalyticsModel> implements IMemberAnalyticsRepository {
  constructor() {
    super(MemberAnalyticsModel);
  }
}
