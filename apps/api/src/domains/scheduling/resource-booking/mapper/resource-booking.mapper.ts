import { IResourceBookingModel } from '../model/resource-booking.model.js';
import { IResourceBooking } from '../interfaces/resource-booking.interface.js';

export class ResourceBookingMapper {
  static toDTO(model: IResourceBookingModel): IResourceBooking {
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
