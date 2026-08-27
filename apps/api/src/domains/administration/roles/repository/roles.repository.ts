import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IRolesModel, RolesModel } from '../model/roles.model.js';

export interface IRolesRepository extends IBaseRepository<IRolesModel> {}

export class RolesRepository extends BaseRepository<IRolesModel> implements IRolesRepository {
  constructor() {
    super(RolesModel);
  }
}
