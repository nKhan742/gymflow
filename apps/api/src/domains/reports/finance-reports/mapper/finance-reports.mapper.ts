import { IFinanceReportsModel } from '../model/finance-reports.model.js';
import { IFinanceReports } from '../interfaces/finance-reports.interface.js';

export class FinanceReportsMapper {
  static toDTO(model: IFinanceReportsModel): IFinanceReports {
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
