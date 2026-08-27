import { IBookingsModel } from '../model/bookings.model.js';
import { IBookings } from '../interfaces/bookings.interface.js';

export class BookingsMapper {
  static toDTO(model: IBookingsModel): IBookings {
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
