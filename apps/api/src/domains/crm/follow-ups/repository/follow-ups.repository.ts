import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IFollowUpsModel, FollowUpsModel } from '../model/follow-ups.model.js';

export interface IFollowUpsRepository extends IBaseRepository<IFollowUpsModel> {}

export class FollowUpsRepository extends BaseRepository<IFollowUpsModel> implements IFollowUpsRepository {
  constructor() {
    super(FollowUpsModel);
  }
}
