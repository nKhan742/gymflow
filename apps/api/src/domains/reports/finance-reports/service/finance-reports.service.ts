import { BaseService } from '../../../../shared/base/BaseService.js';
import { IFinanceReportsRepository, FinanceReportsRepository } from '../repository/finance-reports.repository.js';
import { CreateFinanceReportsDto, UpdateFinanceReportsDto } from '../dto/index.js';
import { FinanceReportsMapper } from '../mapper/finance-reports.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class FinanceReportsService extends BaseService {
  constructor(private readonly repo: IFinanceReportsRepository = new FinanceReportsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateFinanceReportsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return FinanceReportsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('FinanceReports record not found');
    return FinanceReportsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(FinanceReportsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateFinanceReportsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('FinanceReports record not found');
    return FinanceReportsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('FinanceReports record not found');
    return true;
  }
}
