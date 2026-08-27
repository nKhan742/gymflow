import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IPreferencesModel, PreferencesModel } from '../model/preferences.model.js';

export interface IPreferencesRepository extends IBaseRepository<IPreferencesModel> {}

export class PreferencesRepository extends BaseRepository<IPreferencesModel> implements IPreferencesRepository {
  constructor() {
    super(PreferencesModel);
  }
}
