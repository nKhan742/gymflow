import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IUsersModel, UsersModel } from '../model/users.model.js';

export interface IUsersRepository extends IBaseRepository<IUsersModel> {}

export class UsersRepository extends BaseRepository<IUsersModel> implements IUsersRepository {
  constructor() {
    super(UsersModel);
  }
}
