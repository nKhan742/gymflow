import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { INotificationsModel, NotificationsModel } from '../model/notifications.model.js';

export interface INotificationsRepository extends IBaseRepository<INotificationsModel> {}

export class NotificationsRepository extends BaseRepository<INotificationsModel> implements INotificationsRepository {
  constructor() {
    super(NotificationsModel);
  }
}
