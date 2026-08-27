import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IPosModel, PosModel } from '../model/pos.model.js';

export interface IPosRepository extends IBaseRepository<IPosModel> {}

export class PosRepository extends BaseRepository<IPosModel> implements IPosRepository {
  constructor() {
    super(PosModel);
  }
}
