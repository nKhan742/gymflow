import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IChangePasswordModel, ChangePasswordModel } from '../model/change-password.model.js';

export interface IChangePasswordRepository extends IBaseRepository<IChangePasswordModel> {}

export class ChangePasswordRepository extends BaseRepository<IChangePasswordModel> implements IChangePasswordRepository {
  constructor() {
    super(ChangePasswordModel);
  }
}
