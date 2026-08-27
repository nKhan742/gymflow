import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IEmailModel, EmailModel } from '../model/email.model.js';

export interface IEmailRepository extends IBaseRepository<IEmailModel> {}

export class EmailRepository extends BaseRepository<IEmailModel> implements IEmailRepository {
  constructor() {
    super(EmailModel);
  }
}
