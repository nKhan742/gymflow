import { BaseRepository, IBaseRepository } from '../../../../database/base.repository.js';
import { IAuditLogsModel, AuditLogsModel } from '../model/audit-logs.model.js';

export interface IAuditLogsRepository extends IBaseRepository<IAuditLogsModel> {}

export class AuditLogsRepository extends BaseRepository<IAuditLogsModel> implements IAuditLogsRepository {
  constructor() {
    super(AuditLogsModel);
  }
}
