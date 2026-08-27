import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IAppointmentsModel, AppointmentsModel } from '../model/appointments.model.js';

export interface IAppointmentsRepository extends IBaseRepository<IAppointmentsModel> {}

export class AppointmentsRepository extends BaseRepository<IAppointmentsModel> implements IAppointmentsRepository {
  constructor() {
    super(AppointmentsModel);
  }
}
