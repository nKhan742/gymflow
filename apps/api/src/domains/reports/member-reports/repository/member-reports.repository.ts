import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IMemberReportsModel, MemberReportsModel } from '../model/member-reports.model.js';

export interface IMemberReportsRepository extends IBaseRepository<IMemberReportsModel> {}

export class MemberReportsRepository extends BaseRepository<IMemberReportsModel> implements IMemberReportsRepository {
  constructor() {
    super(MemberReportsModel);
  }
}
