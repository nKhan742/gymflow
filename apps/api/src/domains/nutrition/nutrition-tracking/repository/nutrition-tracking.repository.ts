import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { INutritionTrackingModel, NutritionTrackingModel } from '../model/nutrition-tracking.model.js';

export interface INutritionTrackingRepository extends IBaseRepository<INutritionTrackingModel> {}

export class NutritionTrackingRepository extends BaseRepository<INutritionTrackingModel> implements INutritionTrackingRepository {
  constructor() {
    super(NutritionTrackingModel);
  }
}
