import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IMedicalHistoryModel, MedicalHistoryModel } from '../model/medical-history.model.js';

export interface IMedicalHistoryRepository extends IBaseRepository<IMedicalHistoryModel> {}

export class MedicalHistoryRepository extends BaseRepository<IMedicalHistoryModel> implements IMedicalHistoryRepository {
  constructor() {
    super(MedicalHistoryModel);
  }
}
