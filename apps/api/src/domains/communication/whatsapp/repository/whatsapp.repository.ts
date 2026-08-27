import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IWhatsappModel, WhatsappModel } from '../model/whatsapp.model.js';

export interface IWhatsappRepository extends IBaseRepository<IWhatsappModel> {}

export class WhatsappRepository extends BaseRepository<IWhatsappModel> implements IWhatsappRepository {
  constructor() {
    super(WhatsappModel);
  }
}
