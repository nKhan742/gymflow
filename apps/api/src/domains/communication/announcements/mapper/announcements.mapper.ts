import { IAnnouncementsModel } from '../model/announcements.model.js';
import { IAnnouncements } from '../interfaces/announcements.interface.js';

export class AnnouncementsMapper {
  static toDTO(model: IAnnouncementsModel): IAnnouncements {
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
