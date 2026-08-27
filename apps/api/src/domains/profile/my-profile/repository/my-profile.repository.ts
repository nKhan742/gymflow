import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IMyProfileModel, MyProfileModel } from '../model/my-profile.model.js';

export interface IMyProfileRepository extends IBaseRepository<IMyProfileModel> {}

export class MyProfileRepository extends BaseRepository<IMyProfileModel> implements IMyProfileRepository {
  constructor() {
    super(MyProfileModel);
  }
}
