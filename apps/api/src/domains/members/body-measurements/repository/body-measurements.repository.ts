import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IBodyMeasurementsModel, BodyMeasurementsModel } from '../model/body-measurements.model.js';

export interface IBodyMeasurementsRepository extends IBaseRepository<IBodyMeasurementsModel> {}

export class BodyMeasurementsRepository extends BaseRepository<IBodyMeasurementsModel> implements IBodyMeasurementsRepository {
  constructor() {
    super(BodyMeasurementsModel);
  }
}
