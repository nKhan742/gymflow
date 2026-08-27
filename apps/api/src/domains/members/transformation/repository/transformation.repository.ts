import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ITransformationModel, TransformationModel } from '../model/transformation.model.js';

export interface ITransformationRepository extends IBaseRepository<ITransformationModel> {}

export class TransformationRepository extends BaseRepository<ITransformationModel> implements ITransformationRepository {
  constructor() {
    super(TransformationModel);
  }
}
