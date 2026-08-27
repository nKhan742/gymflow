import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IPermissionsModel, PermissionsModel } from '../model/permissions.model.js';

export interface IPermissionsRepository extends IBaseRepository<IPermissionsModel> {}

export class PermissionsRepository extends BaseRepository<IPermissionsModel> implements IPermissionsRepository {
  constructor() {
    super(PermissionsModel);
  }
}
