import { ISettingsModel } from '../model/settings.model.js';
import { ISettings } from '../interfaces/settings.interface.js';

export class SettingsMapper {
  static toDTO(model: ISettingsModel): ISettings {
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
