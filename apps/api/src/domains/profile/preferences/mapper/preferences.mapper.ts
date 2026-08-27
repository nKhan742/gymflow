import { IPreferencesModel } from '../model/preferences.model.js';
import { IPreferences } from '../interfaces/preferences.interface.js';

export class PreferencesMapper {
  static toDTO(model: IPreferencesModel): IPreferences {
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
