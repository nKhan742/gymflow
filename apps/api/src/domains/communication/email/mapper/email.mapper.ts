import { IEmailModel } from '../model/email.model.js';
import { IEmail } from '../interfaces/email.interface.js';

export class EmailMapper {
  static toDTO(model: IEmailModel): IEmail {
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
