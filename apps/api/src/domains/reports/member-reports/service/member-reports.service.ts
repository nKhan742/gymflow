import { BaseService } from '../../../../shared/base/BaseService.js';
import { IMemberReportsRepository, MemberReportsRepository } from '../repository/member-reports.repository.js';
import { CreateMemberReportsDto, UpdateMemberReportsDto } from '../dto/index.js';
import { MemberReportsMapper } from '../mapper/member-reports.mapper.js';
import { NotFoundException } from '../../../../core/exceptions/HttpException.js';
import { IPaginationOptions } from '../../../../database/base.repository.js';

export class MemberReportsService extends BaseService {
  constructor(private readonly repo: IMemberReportsRepository = new MemberReportsRepository()) {
    super();
  }

  async create(tenantId: string, dto: CreateMemberReportsDto, createdBy?: string) {
    const item = await this.repo.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: (dto.status as any) || 'active',
      createdBy,
    });
    return MemberReportsMapper.toDTO(item);
  }

  async findById(id: string, tenantId: string) {
    const item = await this.repo.findById(id, tenantId);
    if (!item) throw new NotFoundException('MemberReports record not found');
    return MemberReportsMapper.toDTO(item);
  }

  async findAll(tenantId: string, pagination?: IPaginationOptions) {
    const result = await this.repo.find({ tenantId }, pagination);
    return {
      ...result,
      items: result.items.map(MemberReportsMapper.toDTO),
    };
  }

  async update(id: string, tenantId: string, dto: UpdateMemberReportsDto, updatedBy?: string) {
    const item = await this.repo.updateById(id, { ...dto, updatedBy }, tenantId);
    if (!item) throw new NotFoundException('MemberReports record not found');
    return MemberReportsMapper.toDTO(item);
  }

  async delete(id: string, tenantId: string, deletedBy?: string) {
    const deleted = await this.repo.softDelete(id, deletedBy, tenantId);
    if (!deleted) throw new NotFoundException('MemberReports record not found');
    return true;
  }
}
