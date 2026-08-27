import { BaseService } from '../../../../shared/base/BaseService.js';
import { IRevenueReportsRepository, RevenueReportsRepository } from '../repository/revenue-reports.repository.js';
import { CreateRevenueReportsDto, UpdateRevenueReportsDto } from '../dto/index.js';
import { RevenueReportsMapper } from '../mapper/revenue-reports.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class RevenueReportsService extends BaseService {
  constructor(private readonly repo: IRevenueReportsRepository = new RevenueReportsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateRevenueReportsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return RevenueReportsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('RevenueReports record not found');
    return RevenueReportsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(RevenueReportsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateRevenueReportsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('RevenueReports record not found');
    return RevenueReportsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('RevenueReports record not found');
    return true;
  }
}
