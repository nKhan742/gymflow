import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IFeatureFlagsModel, FeatureFlagsModel } from '../model/feature-flags.model.js';

export interface IFeatureFlagsRepository extends IBaseRepository<IFeatureFlagsModel> {}

export class FeatureFlagsRepository extends BaseRepository<IFeatureFlagsModel> implements IFeatureFlagsRepository {
  constructor() {
    super(FeatureFlagsModel);
  }
}
