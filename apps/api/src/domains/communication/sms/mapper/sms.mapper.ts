import { ISmsModel } from '../model/sms.model.js';
import { ISms } from '../interfaces/sms.interface.js';

export class SmsMapper {
  static toDTO(model: ISmsModel): ISms {
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
