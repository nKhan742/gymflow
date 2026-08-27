import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IInventoryReportsModel, InventoryReportsModel } from '../model/inventory-reports.model.js';

export interface IInventoryReportsRepository extends IBaseRepository<IInventoryReportsModel> {}

export class InventoryReportsRepository extends BaseRepository<IInventoryReportsModel> implements IInventoryReportsRepository {
  constructor() {
    super(InventoryReportsModel);
  }
}
