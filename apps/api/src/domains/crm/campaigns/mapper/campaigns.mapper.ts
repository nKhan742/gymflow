import { ICampaignsModel } from '../model/campaigns.model.js';
import { ICampaigns } from '../interfaces/campaigns.interface.js';

export class CampaignsMapper {
  static toDTO(model: ICampaignsModel): ICampaigns {
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
