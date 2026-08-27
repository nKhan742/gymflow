import { BaseService } from '../../../../shared/base/BaseService.js';
import { IAuditLogsRepository, AuditLogsRepository } from '../repository/audit-logs.repository.js';
import { CreateAuditLogsDto, UpdateAuditLogsDto } from '../dto/index.js';
import { AuditLogsMapper } from '../mapper/audit-logs.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class AuditLogsService extends BaseService {
  constructor(private readonly repo: IAuditLogsRepository = new AuditLogsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateAuditLogsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return AuditLogsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('AuditLogs record not found');
    return AuditLogsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(AuditLogsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateAuditLogsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('AuditLogs record not found');
    return AuditLogsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('AuditLogs record not found');
    return true;
  }
}
