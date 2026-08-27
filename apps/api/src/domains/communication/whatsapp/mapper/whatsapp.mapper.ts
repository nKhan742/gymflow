import { IWhatsappModel } from '../model/whatsapp.model.js';
import { IWhatsapp } from '../interfaces/whatsapp.interface.js';

export class WhatsappMapper {
  static toDTO(model: IWhatsappModel): IWhatsapp {
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
