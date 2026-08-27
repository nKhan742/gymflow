import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { ISettingsModel, SettingsModel } from '../model/settings.model.js';

export interface ISettingsRepository extends IBaseRepository<ISettingsModel> {}

export class SettingsRepository extends BaseRepository<ISettingsModel> implements ISettingsRepository {
  constructor() {
    super(SettingsModel);
  }
}
