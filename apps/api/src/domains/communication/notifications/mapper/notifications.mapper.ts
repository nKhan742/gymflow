import { INotificationsModel } from '../model/notifications.model.js';
import { INotifications } from '../interfaces/notifications.interface.js';

export class NotificationsMapper {
  static toDTO(model: INotificationsModel): INotifications {
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
