import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ITrialMembersModel, TrialMembersModel } from '../model/trial-members.model.js';

export interface ITrialMembersRepository extends IBaseRepository<ITrialMembersModel> {}

export class TrialMembersRepository extends BaseRepository<ITrialMembersModel> implements ITrialMembersRepository {
  constructor() {
    super(TrialMembersModel);
  }
}
