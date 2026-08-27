import { IRevenueReportsModel } from '../model/revenue-reports.model.js';
import { IRevenueReports } from '../interfaces/revenue-reports.interface.js';

export class RevenueReportsMapper {
  static toDTO(model: IRevenueReportsModel): IRevenueReports {
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
