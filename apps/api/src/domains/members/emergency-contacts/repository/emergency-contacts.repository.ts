import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IEmergencyContactsModel, EmergencyContactsModel } from '../model/emergency-contacts.model.js';

export interface IEmergencyContactsRepository extends IBaseRepository<IEmergencyContactsModel> {}

export class EmergencyContactsRepository extends BaseRepository<IEmergencyContactsModel> implements IEmergencyContactsRepository {
  constructor() {
    super(EmergencyContactsModel);
  }
}
