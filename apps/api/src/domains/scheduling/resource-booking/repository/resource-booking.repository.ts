import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IResourceBookingModel, ResourceBookingModel } from '../model/resource-booking.model.js';

export interface IResourceBookingRepository extends IBaseRepository<IResourceBookingModel> {}

export class ResourceBookingRepository extends BaseRepository<IResourceBookingModel> implements IResourceBookingRepository {
  constructor() {
    super(ResourceBookingModel);
  }
}
