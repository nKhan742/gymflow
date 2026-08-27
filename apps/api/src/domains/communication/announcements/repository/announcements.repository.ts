import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IAnnouncementsModel, AnnouncementsModel } from '../model/announcements.model.js';

export interface IAnnouncementsRepository extends IBaseRepository<IAnnouncementsModel> {}

export class AnnouncementsRepository extends BaseRepository<IAnnouncementsModel> implements IAnnouncementsRepository {
  constructor() {
    super(AnnouncementsModel);
  }
}
