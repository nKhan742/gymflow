import { IHolidaysModel } from '../model/holidays.model.js';
import { IHolidays } from '../interfaces/holidays.interface.js';

export class HolidaysMapper {
  static toDTO(model: IHolidaysModel): IHolidays {
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
