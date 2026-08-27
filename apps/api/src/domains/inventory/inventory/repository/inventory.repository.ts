import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IInventoryModel, InventoryModel } from '../model/inventory.model.js';

export interface IInventoryRepository extends IBaseRepository<IInventoryModel> {}

export class InventoryRepository extends BaseRepository<IInventoryModel> implements IInventoryRepository {
  constructor() {
    super(InventoryModel);
  }
}
