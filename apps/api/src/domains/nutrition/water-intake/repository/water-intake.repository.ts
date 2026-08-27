import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IWaterIntakeModel, WaterIntakeModel } from '../model/water-intake.model.js';

export interface IWaterIntakeRepository extends IBaseRepository<IWaterIntakeModel> {}

export class WaterIntakeRepository extends BaseRepository<IWaterIntakeModel> implements IWaterIntakeRepository {
  constructor() {
    super(WaterIntakeModel);
  }
}
