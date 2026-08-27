import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IGymProfileModel, GymProfileModel } from '../model/gym-profile.model.js';

export interface IGymProfileRepository extends IBaseRepository<IGymProfileModel> {}

export class GymProfileRepository extends BaseRepository<IGymProfileModel> implements IGymProfileRepository {
  constructor() {
    super(GymProfileModel);
  }
}
