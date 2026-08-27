import { IAppointmentsModel } from '../model/appointments.model.js';
import { IAppointments } from '../interfaces/appointments.interface.js';

export class AppointmentsMapper {
  static toDTO(model: IAppointmentsModel): IAppointments {
    return {
      id: model._id.toString(),
      tenantId: model.tenantId,
      branchId: model.branchId,
      name: model.name,
      code: model.code,
      description: model.description,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
