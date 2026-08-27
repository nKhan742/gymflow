import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IEquipmentModel, EquipmentModel } from '../model/equipment.model.js';

export interface IEquipmentRepository extends IBaseRepository<IEquipmentModel> {}

export class EquipmentRepository extends BaseRepository<IEquipmentModel> implements IEquipmentRepository {
  constructor() {
    super(EquipmentModel);
  }
}
